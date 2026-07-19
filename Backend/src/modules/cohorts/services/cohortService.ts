import { CohortRepository } from '../repositories/cohortRepository';
import { TeamRepository } from '../../teams/repositories/teamRepository';
import { Cohort, Enrollment, Team, User } from '../../../types';
import { AppError } from '../../../middlewares/errorHandler';
import { DBStore } from '../../../services/dbStore';

export interface CohortRoster {
  cohort: Cohort;
  students: Partial<User>[];
  teams: Team[];
}

export class CohortService {
  constructor(
    private cohortRepository: CohortRepository,
    private teamRepository?: TeamRepository
  ) {}

  /**
   * Team-formation data for a cohort: the full student roster (resolved to
   * names/avatars) plus every team in the cohort with populated members. Used
   * by the drag-and-drop team board in both the admin and instructor apps.
   */
  async getRoster(cohortId: string): Promise<CohortRoster> {
    const cohort = await this.getCohortDetails(cohortId);
    const studentIds = [...new Set((cohort.students || []).map((s) => s.toString()))];
    const students = (
      await Promise.all(studentIds.map((id) => DBStore.getUserById(id).catch(() => null)))
    )
      .filter((u): u is User => !!u)
      .map((u) => ({ id: u.id, name: u.name, email: u.email, avatar: u.avatar, role: u.role }));

    const teams = this.teamRepository ? await this.teamRepository.findByCohortId(cohortId) : [];
    return { cohort, students, teams };
  }

  async listCohorts(filters: {
    page: number;
    limit: number;
    courseId?: string;
    studentId?: string;
  }): Promise<{ docs: Cohort[]; total: number }> {
    return this.cohortRepository.findPaginated(filters);
  }

  async getCohortDetails(id: string): Promise<Cohort> {
    const cohort = await this.cohortRepository.findById(id);
    if (!cohort) {
      throw new AppError('Cohort not found', 404);
    }
    return cohort;
  }

  async createCohort(userId: string, userName: string, cohortData: Omit<Cohort, 'id' | 'status' | 'students'>): Promise<Cohort> {
    const course = await DBStore.getCourseById(cohortData.courseId);
    if (!course) {
      throw new AppError('Parent course not found', 404);
    }

    const cohort = await this.cohortRepository.create({
      ...cohortData,
      status: 'upcoming',
      students: []
    });

    await DBStore.logActivity(userId, userName, 'COHORT_CREATE', `Created cohort "${cohortData.name}" for course "${course.title}"`);
    return cohort;
  }

  async enrollInCohort(userId: string, userName: string, cohortId: string, studentId: string): Promise<Enrollment> {
    const cohort = await this.getCohortDetails(cohortId);

    if (cohort.students && cohort.students.includes(studentId)) {
      throw new AppError('Student is already enrolled in this cohort', 409);
    }

    if (cohort.students && cohort.students.length >= cohort.maxCapacity) {
      throw new AppError('Cohort has reached maximum enrollment capacity', 400);
    }

    const student = await DBStore.getUserById(studentId);
    if (!student) {
      throw new AppError('Student user account not found', 404);
    }

    const enrollment = await this.cohortRepository.createEnrollment({
      studentId,
      cohortId,
      status: 'enrolled',
      progressPercentage: 0,
      enrolledAt: new Date().toISOString()
    });

    // Update students array
    const currentStudents = cohort.students || [];
    currentStudents.push(studentId);
    await this.cohortRepository.update(cohortId, { students: currentStudents });

    await DBStore.logActivity(
      userId,
      userName,
      'COHORT_ENROLL',
      `Enrolled student "${student.name}" into cohort "${cohort.name}"`
    );

    return enrollment;
  }

  async updateCohortStatus(userId: string, userName: string, id: string, status: any): Promise<Cohort> {
    const cohort = await this.getCohortDetails(id);
    const updated = await this.cohortRepository.update(id, { status });
    if (!updated) {
      throw new AppError('Cohort not found', 404);
    }

    await DBStore.logActivity(
      userId,
      userName,
      'COHORT_STATUS_UPDATE',
      `Updated status of cohort "${cohort.name}" to: "${status}"`
    );

    return updated;
  }

  async updateCohort(userId: string, userName: string, id: string, updateData: Partial<Cohort>): Promise<Cohort> {
    const cohort = await this.getCohortDetails(id);
    const updated = await this.cohortRepository.update(id, updateData);
    if (!updated) {
      throw new AppError('Cohort not found', 404);
    }
    await DBStore.logActivity(userId, userName, 'COHORT_UPDATE', `Updated cohort "${cohort.name}"`);
    return updated;
  }

  async deleteCohort(userId: string, userName: string, id: string): Promise<void> {
    const cohort = await this.getCohortDetails(id);
    const deleted = await this.cohortRepository.delete(id);
    if (!deleted) {
      throw new AppError('Failed to delete cohort', 500);
    }
    await DBStore.logActivity(userId, userName, 'COHORT_DELETE', `Deleted cohort "${cohort.name}"`);
  }
}
