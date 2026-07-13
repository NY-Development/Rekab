import bcrypt from 'bcryptjs';
import { AdminRepository } from '../repositories/adminRepository';
import { UserRepository } from '../../users/repositories/userRepository';
import { ActivityLog, User, UserRole } from '../../../types';
import { AppError } from '../../../middlewares/errorHandler';

function sanitizeUser(u: User): Omit<User, 'passwordHash'> {
  return {
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
  };
}

export class AdminService {
  constructor(
    private adminRepository: AdminRepository,
    private userRepository: UserRepository
  ) {}

  async listUsers(filters: { page: number; limit: number; search?: string; role?: string }): Promise<{
    docs: Omit<User, 'passwordHash'>[];
    total: number;
  }> {
    const data = await this.adminRepository.getAllDataForStats();
    let users = data.users;

    if (filters.search) {
      const search = filters.search.toLowerCase();
      users = users.filter(
        (u) => u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search)
      );
    }
    if (filters.role) {
      users = users.filter((u) => u.role.toUpperCase() === filters.role!.toUpperCase());
    }

    const total = users.length;
    const start = (filters.page - 1) * filters.limit;
    const docs = users.slice(start, start + filters.limit).map(sanitizeUser);

    return { docs, total };
  }

  async getUserById(id: string): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return sanitizeUser(user);
  }

  async createUser(data: { name: string; email: string; password: string; role: UserRole }): Promise<Omit<User, 'passwordHash'>> {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw new AppError('A user with this email address already exists', 409);
    }
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await this.userRepository.create({
      name: data.name,
      firstName: data.name.split(' ')[0] || data.name,
      lastName: data.name.split(' ').slice(1).join(' ') || data.name,
      email: data.email.toLowerCase(),
      passwordHash,
      role: data.role,
      authProvider: 'LOCAL',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}`,
      isActive: true,
      isBlocked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return sanitizeUser(user);
  }

  async updateUser(id: string, data: Partial<User>): Promise<Omit<User, 'passwordHash'>> {
    const updated = await this.userRepository.update(id, { ...data, updatedAt: new Date().toISOString() });
    if (!updated) {
      throw new AppError('User not found', 404);
    }
    return sanitizeUser(updated);
  }

  async deleteUser(id: string): Promise<void> {
    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw new AppError('User not found', 404);
    }
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
