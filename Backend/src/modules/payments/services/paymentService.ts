import { PaymentRepository } from '../repositories/paymentRepository';
import { EnrollmentRepository } from '../../enrollments/repositories/enrollmentRepository';
import { CourseRepository } from '../../courses/repositories/courseRepository';
import { CohortRepository } from '../../cohorts/repositories/cohortRepository';
import { PaymentVerificationService } from '../../../services/paymentVerification.service';
import { SubmitPaymentDto, AdminVerifyPaymentDto } from '../dtos/paymentDto';
import { Payment, Cohort } from '../../../types';
import { AppError } from '../../../middlewares/errorHandler';
import { SETTLEMENT_ACCOUNTS, PAYMENT_METHOD_TO_PROVIDER, deriveAccountSuffix } from '../../../configs/settlementAccounts';
import { refId } from '../../../services/accessControl.service';

export class PaymentService {
  constructor(
    private paymentRepository: PaymentRepository,
    private enrollmentRepository: EnrollmentRepository,
    private courseRepository: CourseRepository,
    private cohortRepository: CohortRepository
  ) {}

  async getPaymentById(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findById(id);
    if (!payment) {
      throw new AppError('Payment not found', 404);
    }
    return payment;
  }

  async submitAndVerify(studentId: string, data: SubmitPaymentDto): Promise<{ payment: Payment; cohort: Cohort | null }> {
    // 1. Retrieve the enrollment. The repository POPULATES studentId/courseId/
    // cohortId into objects, so refId() is used to pull the raw id out — a bare
    // .toString() on a populated ref yields "[object Object]".
    const enrollment = await this.enrollmentRepository.findById(data.enrollmentId);
    if (!enrollment) {
      throw new AppError('Enrollment not found', 404);
    }

    const enrollmentStudentId = refId(enrollment.studentId);
    const courseId = refId(enrollment.courseId);
    const enrollmentCohortId = refId(enrollment.cohortId);

    if (enrollmentStudentId !== studentId) {
      throw new AppError('You are not allowed to pay for this enrollment.', 403);
    }

    if (enrollment.status.toUpperCase() === 'ACTIVE' || enrollment.status.toUpperCase() === 'APPROVED' || enrollment.status.toUpperCase() === 'enrolled') {
      throw new AppError('Enrollment is already active and paid for', 409);
    }

    // 2. Check for duplicate references
    const existingRef = await this.paymentRepository.findByTransactionReference(data.transactionReference);
    if (existingRef) {
      throw new AppError('This transaction reference has already been submitted', 409);
    }

    // 3. Retrieve the course price to verify payment completeness
    if (!courseId) throw new AppError('Enrollment is missing a valid courseId', 400);
    const course = await this.courseRepository.findById(courseId);
    if (!course) {
      throw new AppError('Course associated with this enrollment not found', 404);
    }

    // 4. Perform payment verification via Verify.ET.
    // Prefer the student's selected method to pick the provider (pattern
    // detection is a fallback). Verify.ET requires the receiver account suffix
    // for bank transfers (CBE 8 digits, BOA 5) and uses settlementAccount to
    // confirm the money landed in the school's account — without these, CBE/BOA
    // verifications fail outright.
    const provider =
      PAYMENT_METHOD_TO_PROVIDER[data.paymentMethod] ||
      PaymentVerificationService.detectProvider(data.transactionReference);
    const settle = SETTLEMENT_ACCOUNTS[provider];
    const settlementAccount = settle?.account || undefined;
    const accountSuffix = settlementAccount ? deriveAccountSuffix(provider, settlementAccount) : undefined;
    const phoneNumber = settle?.phone || undefined;

    const verification = await PaymentVerificationService.verifyWithProvider({
      provider,
      reference: data.transactionReference,
      accountSuffix,
      settlementAccount,
      phoneNumber,
    });

    if (!verification.success || !verification.verified) {
      // Prefer the bank's specific error message over the generic envelope text.
      const bankMessage =
        verification.raw?.data?.errorMessage ||
        verification.raw?.errorMessage ||
        verification.raw?.message ||
        'Verify.ET could not verify your transaction reference.';
      // Create failed payment record
      await this.paymentRepository.create({
        studentId,
        enrollmentId: data.enrollmentId,
        courseId: courseId as any,
        amount: verification.amount || 0,
        currency: verification.currency || 'ETB',
        paymentMethod: data.paymentMethod,
        transactionReference: data.transactionReference,
        status: 'FAILED',
        notes: `Verify.ET verification failed: ${bankMessage}`,
      });
      throw new AppError(`Payment verification failed: ${bankMessage}`, 400);
    }

    const minRequired = course.price;
    if (verification.amount < (minRequired ?? 0)) {
      // Create failed payment record due to insufficient funds
      await this.paymentRepository.create({
        studentId,
        enrollmentId: data.enrollmentId,
        courseId: courseId as any,
        amount: verification.amount,
        currency: verification.currency,
        paymentMethod: data.paymentMethod,
        transactionReference: data.transactionReference,
        status: 'FAILED',
        notes: `Insufficient amount paid. Required: ${minRequired} ${course.currency || 'ETB'}, paid: ${verification.amount} ${verification.currency}`,
      });
      throw new AppError(`Course requires a payment of at least ${minRequired} ${course.currency || 'ETB'}. You paid ${verification.amount} ${verification.currency}.`, 400);
    }

    // 5. Create verified payment record
    const payment = await this.paymentRepository.create({
      studentId,
      enrollmentId: data.enrollmentId,
      courseId: courseId as any,
      amount: verification.amount,
      currency: verification.currency,
      paymentMethod: data.paymentMethod,
      transactionReference: data.transactionReference,
      paidAt: verification.timestamp ? new Date(verification.timestamp).toISOString() : new Date().toISOString(),
      status: 'VERIFIED',
      notes: data.notes || 'Auto-verified successfully via Verify.ET Integration.',
    });

    // 6. Payment verified — registration is directly activated (skip pending approval)
    await this.enrollmentRepository.update(data.enrollmentId, {
      paymentId: payment.id,
      status: 'ACTIVE',
      enrolledAt: new Date().toISOString(),
    });

    // 7. Add the student to the course's batch cohort
    let cohort: Cohort | null = null;
    if (enrollmentCohortId) {
      cohort = await this.cohortRepository.findById(enrollmentCohortId);
      if (cohort) {
        const students = cohort.students || [];
        if (!students.includes(studentId)) {
          students.push(studentId);
          cohort = await this.cohortRepository.update(enrollmentCohortId, { students });
        }
      }
    }

    return { payment, cohort };
  }

  async adminUpdatePayment(id: string, adminId: string, data: AdminVerifyPaymentDto): Promise<Payment> {
    const payment = await this.paymentRepository.findById(id);
    if (!payment) {
      throw new AppError('Payment record not found', 404);
    }

    const updateFields: Partial<Payment> = {
      status: data.status,
      notes: data.notes ? `${payment.notes || ''} | Admin Update: ${data.notes}` : payment.notes,
      verifiedBy: adminId,
      verificationDate: new Date().toISOString(),
    };

    const updated = await this.paymentRepository.update(id, updateFields);
    if (!updated) {
      throw new AppError('Failed to update payment status', 500);
    }

    // payment.enrollmentId is populated by the repository — pull the raw id.
    const eId = refId(payment.enrollmentId);
    if (!eId) throw new AppError('Payment is missing enrollmentId', 400);

    // Admin marking a payment VERIFIED grants access immediately (same as the
    // auto-verified flow): activate the enrollment and add the student to the
    // course's batch cohort.
    if (data.status === 'VERIFIED' && payment.status !== 'VERIFIED') {
      await this.enrollmentRepository.update(eId, {
        paymentId: payment.id,
        status: 'ACTIVE',
        enrolledAt: new Date().toISOString(),
      });
      const enrollment = await this.enrollmentRepository.findById(eId);
      const cohortId = refId(enrollment?.cohortId);
      const studentId = refId(enrollment?.studentId);
      if (cohortId && studentId) {
        const cohort = await this.cohortRepository.findById(cohortId);
        if (cohort) {
          const students = cohort.students || [];
          if (!students.includes(studentId)) {
            students.push(studentId);
            await this.cohortRepository.update(cohortId, { students });
          }
        }
      }
    }

    // If status changed from VERIFIED to FAILED/PENDING, transition enrollment back
    if (data.status !== 'VERIFIED' && payment.status === 'VERIFIED') {
      await this.enrollmentRepository.update(eId, {
        status: 'PENDING',
      });
    }

    return updated;
  }

  async listPayments(filters: {
    page: number;
    limit: number;
    studentId?: string;
    courseId?: string;
    enrollmentId?: string;
    status?: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<{ docs: Payment[]; total: number }> {
    return this.paymentRepository.findPaginated(filters);
  }

  async getStudentPayments(studentId: string): Promise<Payment[]> {
    const result = await this.paymentRepository.findPaginated({
      page: 1,
      limit: 100,
      studentId,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    return result.docs;
  }
}
