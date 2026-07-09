import { AnnouncementRepository } from '../repositories/announcementRepository';
import { CreateAnnouncementDto, UpdateAnnouncementDto } from '../dtos/announcementDto';
import { Announcement } from '../../../types';
import { AppError } from '../../../middlewares/errorHandler';

export class AnnouncementService {
  constructor(private announcementRepository: AnnouncementRepository) {}

  async getAnnouncementById(id: string): Promise<Announcement> {
    const announcement = await this.announcementRepository.findById(id);
    if (!announcement) {
      throw new AppError('Announcement not found', 404);
    }
    return announcement;
  }

  async createAnnouncement(creatorId: string, data: CreateAnnouncementDto): Promise<Announcement> {
    const payload = {
      ...data,
      createdBy: creatorId,
      publishDate: data.publishDate || new Date().toISOString(),
    };
    return this.announcementRepository.create(payload);
  }

  async updateAnnouncement(id: string, updateData: UpdateAnnouncementDto): Promise<Announcement> {
    const announcement = await this.announcementRepository.findById(id);
    if (!announcement) {
      throw new AppError('Announcement not found', 404);
    }
    const updated = await this.announcementRepository.update(id, updateData);
    if (!updated) {
      throw new AppError('Failed to update announcement', 500);
    }
    return updated;
  }

  async deleteAnnouncement(id: string): Promise<void> {
    const announcement = await this.announcementRepository.findById(id);
    if (!announcement) {
      throw new AppError('Announcement not found', 404);
    }
    const deleted = await this.announcementRepository.delete(id);
    if (!deleted) {
      throw new AppError('Failed to delete announcement', 500);
    }
  }

  async listAnnouncements(filters: {
    page: number;
    limit: number;
    courseId?: string;
    cohortId?: string;
    teamId?: string;
    priority?: string;
    search?: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<{ docs: Announcement[]; total: number }> {
    return this.announcementRepository.findPaginated(filters);
  }
}
