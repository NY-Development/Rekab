import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth';
import { AnnouncementService } from '../services/announcementService';
import { CreateAnnouncementSchema, UpdateAnnouncementSchema, AnnouncementFilterSchema } from '../validators/announcementValidator';

export class AnnouncementController {
  constructor(private announcementService: AnnouncementService) {}

  async getAnnouncementById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const announcement = await this.announcementService.getAnnouncementById(req.params.id);
      res.status(200).json({ status: 'success', data: announcement });
    } catch (error) {
      next(error);
    }
  }

  async listAnnouncements(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await AnnouncementFilterSchema.parseAsync(req.query);
      const result = await this.announcementService.listAnnouncements(validated);
      res.status(200).json({
        status: 'success',
        data: result.docs,
        pagination: {
          page: validated.page,
          limit: validated.limit,
          total: result.total,
          pages: Math.ceil(result.total / validated.limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async createAnnouncement(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }
      const validated = await CreateAnnouncementSchema.parseAsync(req.body);
      const announcement = await this.announcementService.createAnnouncement(req.user.id, validated as any);
      res.status(201).json({ status: 'success', data: announcement });
    } catch (error) {
      next(error);
    }
  }

  async updateAnnouncement(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await UpdateAnnouncementSchema.parseAsync(req.body);
      const announcement = await this.announcementService.updateAnnouncement(req.params.id, validated);
      res.status(200).json({ status: 'success', data: announcement });
    } catch (error) {
      next(error);
    }
  }

  async deleteAnnouncement(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.announcementService.deleteAnnouncement(req.params.id);
      res.status(200).json({ status: 'success', message: 'Announcement deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
