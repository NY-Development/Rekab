import { InstructorRepository } from '../repositories/instructorRepository';
import { CreateInstructorProfileDto, UpdateInstructorProfileDto } from '../dtos/instructorDto';
import { InstructorProfile } from '../../../types';
import { AppError } from '../../../middlewares/errorHandler';

export class InstructorService {
  constructor(private instructorRepository: InstructorRepository) {}

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
    const existing = await this.instructorRepository.findByUserId(data.userId);
    if (existing) {
      throw new AppError('Instructor profile already exists for this user', 409);
    }
    return this.instructorRepository.create(data);
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
