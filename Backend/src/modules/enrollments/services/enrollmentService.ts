import { EnrollmentRepository } from '../repositories/enrollmentRepository';
import { CreateEnrollmentDto, UpdateEnrollmentDto } from '../dtos/enrollmentDto';
import { Enrollment } from '../../../types';
import { AppError } from '../../../middlewares/errorHandler';

export class EnrollmentService {
  constructor(private enrollmentRepository: EnrollmentRepository) {}

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

  async apply(data: CreateEnrollmentDto): Promise<Enrollment> {
    // Check for existing active or pending enrollment for the same course
    if (!data.studentId || !data.courseId) throw new AppError('Missing IDs', 400);
    const existing = await this.enrollmentRepository.findByStudentAndCourse(data.studentId, data.courseId);
    if (existing) {
      const statusUpper = existing.status.toUpperCase();
      if (statusUpper === 'PENDING' || statusUpper === 'ACTIVE' || statusUpper === 'APPROVED' || statusUpper === 'enrolled') {
        throw new AppError('You are already enrolled or have a pending application for this course', 409);
      }
    }

    return this.enrollmentRepository.create(data);
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
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<{ docs: Enrollment[]; total: number }> {
    return this.enrollmentRepository.findPaginated(filters);
  }
}
