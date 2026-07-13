import { EnrollmentRepository } from '../repositories/enrollmentRepository';
import { CohortRepository } from '../../cohorts/repositories/cohortRepository';
import { CreateEnrollmentDto, UpdateEnrollmentDto } from '../dtos/enrollmentDto';
import { Enrollment } from '../../../types';
import { AppError } from '../../../middlewares/errorHandler';
import { DBStore } from '../../../services/dbStore';

export class EnrollmentService {
  constructor(
    private enrollmentRepository: EnrollmentRepository,
    private cohortRepository: CohortRepository
  ) {}

  async getEnrollmentById(id: string): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepository.findById(id);
    if (!enrollment) {
      throw new AppError('Enrollment not found', 404);
    }
    return enrollment;
  }

  async getStudentEnrollments(studentId: string): Promise<Enrollment[]> {
    const result = await this.enrollmentRepository.findPaginated({
      page: 1,
      limit: 100,
      studentId,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    return result.docs;
  }

  private async resolveCohortId(courseId: string): Promise<string> {
    const { docs } = await this.cohortRepository.findPaginated({ page: 1, limit: 50, courseId });
    const openCohorts = docs
      .filter((c) => c.status === 'upcoming' || c.status === 'active')
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    if (openCohorts.length === 0) {
      throw new AppError('No open cohort is currently available for this course. Please contact support.', 400);
    }
    return openCohorts[0].id;
  }

  async apply(data: CreateEnrollmentDto): Promise<Enrollment> {
    if (!data.studentId || !data.courseId) throw new AppError('Missing IDs', 400);
    const existing = await this.enrollmentRepository.findByStudentAndCourse(data.studentId, data.courseId);
    if (existing) {
      const statusUpper = existing.status.toUpperCase();
      if (['PENDING', 'PENDING_APPROVAL', 'APPROVED', 'ACTIVE', 'enrolled'].includes(statusUpper) || existing.status === 'enrolled') {
        throw new AppError('You are already registered or have a pending application for this course', 409);
      }
    }

    const cohortId = data.cohortId || (await this.resolveCohortId(data.courseId));

    return this.enrollmentRepository.create({ ...data, cohortId });
  }

  async updateEnrollment(id: string, updateData: UpdateEnrollmentDto): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepository.findById(id);
    if (!enrollment) {
      throw new AppError('Enrollment not found', 404);
    }

    // Capture standard status updates
    if (updateData.status && updateData.status !== enrollment.status) {
      if (updateData.status.toUpperCase() === 'COMPLETED' || updateData.status.toUpperCase() === 'completed') {
        updateData.completedAt = new Date().toISOString();
      }
    }

    const updated = await this.enrollmentRepository.update(id, updateData);
    if (!updated) {
      throw new AppError('Failed to update enrollment', 500);
    }
    return updated;
  }

  async approve(id: string, reviewerId: string, reviewerName: string, notes?: string): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepository.findById(id);
    if (!enrollment) throw new AppError('Registration not found', 404);

    const updated = await this.enrollmentRepository.update(id, {
      status: 'APPROVED',
      reviewerId,
      reviewNotes: notes,
      approvedAt: new Date().toISOString(),
    });
    if (!updated) throw new AppError('Failed to approve registration', 500);

    await DBStore.logActivity(reviewerId, reviewerName, 'REGISTRATION_APPROVE', `Approved registration ${id}`);
    return updated;
  }

  async reject(id: string, reviewerId: string, reviewerName: string, reason: string, notes?: string): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepository.findById(id);
    if (!enrollment) throw new AppError('Registration not found', 404);

    const updated = await this.enrollmentRepository.update(id, {
      status: 'REJECTED',
      reviewerId,
      reviewNotes: notes,
      rejectionReason: reason,
      rejectedAt: new Date().toISOString(),
    });
    if (!updated) throw new AppError('Failed to reject registration', 500);

    await DBStore.logActivity(reviewerId, reviewerName, 'REGISTRATION_REJECT', `Rejected registration ${id}: ${reason}`);
    return updated;
  }

  async grantAccess(id: string, reviewerId: string, reviewerName: string): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepository.findById(id);
    if (!enrollment) throw new AppError('Registration not found', 404);
    if (enrollment.status.toUpperCase() !== 'APPROVED') {
      throw new AppError('Only approved registrations can be granted course access', 400);
    }

    const updated = await this.enrollmentRepository.update(id, {
      status: 'ACTIVE',
      enrolledAt: new Date().toISOString(),
    });
    if (!updated) throw new AppError('Failed to grant course access', 500);

    await DBStore.logActivity(reviewerId, reviewerName, 'REGISTRATION_GRANT_ACCESS', `Granted course access for registration ${id}`);
    return updated;
  }

  async suspend(id: string, reviewerId: string, reviewerName: string, notes?: string): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepository.findById(id);
    if (!enrollment) throw new AppError('Registration not found', 404);

    const updated = await this.enrollmentRepository.update(id, {
      status: 'SUSPENDED',
      reviewerId,
      reviewNotes: notes,
    });
    if (!updated) throw new AppError('Failed to suspend course access', 500);

    await DBStore.logActivity(reviewerId, reviewerName, 'REGISTRATION_SUSPEND', `Suspended course access for registration ${id}`);
    return updated;
  }

  async deleteEnrollment(id: string): Promise<void> {
    const enrollment = await this.enrollmentRepository.findById(id);
    if (!enrollment) {
      throw new AppError('Enrollment not found', 404);
    }
    const deleted = await this.enrollmentRepository.delete(id);
    if (!deleted) {
      throw new AppError('Failed to delete enrollment', 500);
    }
  }

  async listEnrollments(filters: {
    page: number;
    limit: number;
    studentId?: string;
    courseId?: string;
    cohortId?: string;
    status?: string;
    paymentStatus?: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<{ docs: Enrollment[]; total: number }> {
    return this.enrollmentRepository.findPaginated(filters);
  }
}
