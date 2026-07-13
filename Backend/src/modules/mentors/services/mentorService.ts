import { MentorRepository } from '../repositories/mentorRepository';
import { CreateMentorProfileDto, UpdateMentorProfileDto } from '../dtos/mentorDto';
import { MentorProfile } from '../../../types';
import { AppError } from '../../../middlewares/errorHandler';

export class MentorService {
  constructor(private mentorRepository: MentorRepository) {}

  async getProfileByUserId(userId: string): Promise<MentorProfile> {
    const profile = await this.mentorRepository.findByUserId(userId);
    if (!profile) {
      throw new AppError('Mentor profile not found for this user', 404);
    }
    return profile;
  }

  async getProfileById(id: string): Promise<MentorProfile> {
    const profile = await this.mentorRepository.findById(id);
    if (!profile) {
      throw new AppError('Mentor profile not found', 404);
    }
    return profile;
  }

  async createProfile(data: CreateMentorProfileDto): Promise<MentorProfile> {
    const existing = await this.mentorRepository.findByUserId(data.userId);
    if (existing) {
      throw new AppError('Mentor profile already exists for this user', 409);
    }
    return this.mentorRepository.create(data);
  }

  async updateProfile(id: string, updateData: UpdateMentorProfileDto): Promise<MentorProfile> {
    const profile = await this.mentorRepository.findById(id);
    if (!profile) {
      throw new AppError('Mentor profile not found', 404);
    }

    const updated = await this.mentorRepository.update(id, updateData);
    if (!updated) {
      throw new AppError('Failed to update mentor profile', 500);
    }
    return updated;
  }

  async deleteProfile(id: string): Promise<void> {
    const deleted = await this.mentorRepository.delete(id);
    if (!deleted) {
      throw new AppError('Mentor profile not found', 404);
    }
  }

  async getMentors(filters: {
    page: number;
    limit: number;
    search?: string;
    specialization?: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<{ docs: MentorProfile[]; total: number }> {
    return this.mentorRepository.findPaginated(filters);
  }
}
