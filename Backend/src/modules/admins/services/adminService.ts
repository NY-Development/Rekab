import { AdminRepository } from '../repositories/adminRepository';
import { ActivityLog, User } from '../../../types';

export class AdminService {
  constructor(private adminRepository: AdminRepository) {}

  async listUsers(): Promise<Omit<User, 'passwordHash'>[]> {
    const data = await this.adminRepository.getAllDataForStats();
    return data.users.map(u => ({
      id: u.id,
      name: u.name,
      firstName: u.firstName,
      middleName: u.middleName,
      lastName: u.lastName,
      username: u.username,
      email: u.email,
      phone: u.phone,
      role: u.role,
      isEmailVerified: u.isEmailVerified,
      emailVerifiedAt: u.emailVerifiedAt,
      profileImage: u.profileImage,
      avatar: u.avatar,
      bio: u.bio,
      isActive: u.isActive,
      isBlocked: u.isBlocked,
      blockReason: u.blockReason,
      lastLogin: u.lastLogin,
      refreshTokenVersion: u.refreshTokenVersion,
      passwordChangedAt: u.passwordChangedAt,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt
    }));
  }

  async getSystemLogs(): Promise<ActivityLog[]> {
    return this.adminRepository.getActivityLogs();
  }

  async getDashboardStats() {
    const { users, courses, cohorts, enrollments, submissions } = await this.adminRepository.getAllDataForStats();

    const studentsCount = users.filter(u => u.role === 'student' || u.role === 'STUDENT' || u.role === 'ADMIN' || u.role === 'SUPER_ADMIN').length;
    const instructorsCount = users.filter(u => u.role === 'instructor' || u.role === 'INSTRUCTOR').length;
    const activeCohortsCount = cohorts.filter(c => c.status === 'active').length;

    const completedEnrollments = enrollments.filter(e => e.status === 'completed').length;
    const completionRate = enrollments.length > 0
      ? Math.round((completedEnrollments / enrollments.length) * 100)
      : 0;

    const gradedCount = submissions.filter(s => s.status === 'graded').length;

    return {
      totalStudents: studentsCount,
      totalInstructors: instructorsCount,
      totalCourses: courses.length,
      activeCohorts: activeCohortsCount,
      totalEnrollments: enrollments.length,
      completionRate,
      totalSubmissions: submissions.length,
      pendingGrading: submissions.length - gradedCount
    };
  }
}
