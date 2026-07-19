import { PaymentRepository } from '../repositories/paymentRepository';
import { EnrollmentRepository } from '../../enrollments/repositories/enrollmentRepository';
import { CourseRepository } from '../../courses/repositories/courseRepository';
import { CohortRepository } from '../../cohorts/repositories/cohortRepository';
import { PaymentVerificationService } from '../../../services/paymentVerification.service';
import { SubmitPaymentDto, AdminVerifyPaymentDto } from '../dtos/paymentDto';
import { Payment, Cohort, Enrollment } from '../../../types';
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
    
    // Sum previous payments for this enrollment
    const paymentsResult = await this.paymentRepository.findPaginated({
      page: 1,
      limit: 100,
      enrollmentId: enrollment.id,
      sortBy: 'createdAt',
      sortOrder: 'asc'
    });
    let totalPaidBefore = 0;
    for (const p of paymentsResult.docs) {
      if (p.status === 'VERIFIED' || p.status === 'PARTIAL_PAYMENT') {
        totalPaidBefore += p.amount || 0;
      }
    }

    const currentRemainingDue = Math.max(0, (course.price || 0) - totalPaidBefore);
    if (currentRemainingDue === 0) {
      throw new AppError('This enrollment is already fully paid.', 400);
    }

    // Determine status of this payment
    let finalStatus = 'PARTIAL_PAYMENT';
    if (verification.amount >= currentRemainingDue) {
      finalStatus = 'VERIFIED';
    }

    // 5. Create payment record
    const payment = await this.paymentRepository.create({
      studentId,
      enrollmentId: data.enrollmentId,
      courseId: courseId as any,
      amount: verification.amount,
      currency: verification.currency,
      paymentMethod: data.paymentMethod,
      transactionReference: data.transactionReference,
      paidAt: verification.timestamp ? new Date(verification.timestamp).toISOString() : new Date().toISOString(),
      status: finalStatus,
      notes: data.notes || 'Auto-verified successfully via Verify.ET Integration.',
    });

    // 6. Recalculate enrollment payment state and adjust status
    await this.recalculateEnrollmentPayments(enrollment.id);

    // 7. Get final cohort details
    let cohort: Cohort | null = null;
    if (enrollmentCohortId) {
      cohort = await this.cohortRepository.findById(enrollmentCohortId);
    }

    return { payment, cohort };
  }

  async recalculateEnrollmentPayments(enrollmentId: string): Promise<void> {
    const enrollment = await this.enrollmentRepository.findById(enrollmentId);
    if (!enrollment) return;

    const courseId = refId(enrollment.courseId);
    if (!courseId) return;

    const course = await this.courseRepository.findById(courseId);
    if (!course) return;

    const paymentsResult = await this.paymentRepository.findPaginated({
      page: 1,
      limit: 100,
      enrollmentId,
      sortBy: 'createdAt',
      sortOrder: 'asc'
    });

    let totalPaid = 0;
    for (const p of paymentsResult.docs) {
      if (p.status === 'VERIFIED' || p.status === 'PARTIAL_PAYMENT') {
        totalPaid += p.amount || 0;
      }
    }

    const coursePrice = course.price || 0;
    const remainingDue = Math.max(0, coursePrice - totalPaid);

    const updateFields: Partial<Enrollment> = {
      amountPaid: totalPaid,
      remainingDue: remainingDue
    };

    if (paymentsResult.docs.length > 0) {
      const latestPayment = paymentsResult.docs[paymentsResult.docs.length - 1];
      updateFields.paymentId = latestPayment.id;
    }

    if (remainingDue === 0 && totalPaid > 0) {
      updateFields.status = 'ACTIVE';
      updateFields.enrolledAt = new Date().toISOString();

      // Add to Cohort
      const studentId = refId(enrollment.studentId);
      const cohortId = refId(enrollment.cohortId);
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
    } else {
      updateFields.status = 'PENDING';

      // Remove from Cohort
      const studentId = refId(enrollment.studentId);
      const cohortId = refId(enrollment.cohortId);
      if (cohortId && studentId) {
        const cohort = await this.cohortRepository.findById(cohortId);
        if (cohort) {
          const students = cohort.students || [];
          if (students.includes(studentId)) {
            const index = students.indexOf(studentId);
            students.splice(index, 1);
            await this.cohortRepository.update(cohortId, { students });
          }
        }
      }
    }

    await this.enrollmentRepository.update(enrollmentId, updateFields);
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

    const eId = refId(payment.enrollmentId);
    if (eId) {
      await this.recalculateEnrollmentPayments(eId);
    }

    const finalPayment = await this.paymentRepository.findById(id);
    return finalPayment || updated;
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
