import { InstructorRepository } from '../repositories/instructorRepository';
import { UserRepository } from '../../users/repositories/userRepository';
import { CreateInstructorProfileDto, UpdateInstructorProfileDto } from '../dtos/instructorDto';
import { InstructorProfile } from '../../../types';
import { AppError } from '../../../middlewares/errorHandler';
import bcrypt from 'bcryptjs';

export class InstructorService {
  constructor(
    private instructorRepository: InstructorRepository,
    private userRepository: UserRepository = new UserRepository()
  ) {}

  async getProfileByUserId(userId: string): Promise<InstructorProfile> {
    const profile = await this.instructorRepository.findByUserId(userId);
    if (!profile) {
      throw new AppError('Instructor profile not found for this user', 404);
    }
    return profile;
  }

  async getProfileById(id: string): Promise<InstructorProfile> {
    const profile = await this.instructorRepository.findById(id);
    if (!profile) {
      throw new AppError('Instructor profile not found', 404);
    }
    return profile;
  }

  async createProfile(data: CreateInstructorProfileDto): Promise<InstructorProfile> {
    let finalUserId = data.userId;

    if (!finalUserId) {
      if (!data.name || !data.email) {
        throw new AppError('Either user ID or both name and email must be provided to create an instructor', 400);
      }

      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser) {
        const existingProfile = await this.instructorRepository.findByUserId(existingUser.id);
        if (existingProfile) {
          throw new AppError('Instructor profile already exists for this email', 409);
        }
        finalUserId = existingUser.id;
      } else {
        // Create user with INSTRUCTOR role and a default password
        const passwordHash = await bcrypt.hash('ChangeMe123!', 10);
        const newUser = await this.userRepository.create({
          name: data.name,
          firstName: data.name.split(' ')[0] || data.name,
          lastName: data.name.split(' ').slice(1).join(' ') || data.name,
          email: data.email.toLowerCase(),
          passwordHash,
          role: 'INSTRUCTOR',
          authProvider: 'LOCAL',
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}`,
          isActive: true,
          isBlocked: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        finalUserId = newUser.id;
      }
    } else {
      const existing = await this.instructorRepository.findByUserId(finalUserId);
      if (existing) {
        throw new AppError('Instructor profile already exists for this user', 409);
      }
    }

    return this.instructorRepository.create({
      userId: finalUserId,
      specialization: data.specialization,
      yearsExperience: data.yearsExperience,
      bio: data.bio,
      skills: data.skills,
      assignedCourses: data.assignedCourses || [],
      assignedCohorts: [],
    } as any);
  }

  async updateProfile(id: string, updateData: UpdateInstructorProfileDto): Promise<InstructorProfile> {
    const profile = await this.instructorRepository.findById(id);
    if (!profile) {
      throw new AppError('Instructor profile not found', 404);
    }

    const updated = await this.instructorRepository.update(id, updateData);
    if (!updated) {
      throw new AppError('Failed to update instructor profile', 500);
    }
    return updated;
  }

  async deleteProfile(id: string): Promise<void> {
    const deleted = await this.instructorRepository.delete(id);
    if (!deleted) {
      throw new AppError('Instructor profile not found', 404);
    }
  }

  async getInstructors(filters: {
    page: number;
    limit: number;
    search?: string;
    specialization?: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<{ docs: InstructorProfile[]; total: number }> {
    return this.instructorRepository.findPaginated(filters);
  }
}
