import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth';
import { AnnouncementService } from '../services/announcementService';
import { CreateAnnouncementSchema, UpdateAnnouncementSchema, AnnouncementFilterSchema } from '../validators/announcementValidator';
import { getContentScope, assertCourseAccess, assertCohortAccess, refId } from '../../../services/accessControl.service';
import { isAdminRole } from '../../../configs/permissions';
import { AppError } from '../../../middlewares/errorHandler';
import { User } from '../../../types';

/**
 * Non-admins may only manage announcements that target a course/cohort in
 * their ownership scope. Global announcements (no course/cohort) are
 * admin-only.
 */
async function assertAnnouncementScope(user: User, courseId?: string, cohortId?: string): Promise<void> {
  if (isAdminRole(user.role)) return;
  if (cohortId) return assertCohortAccess(user, cohortId);
  if (courseId) return assertCourseAccess(user, courseId);
  throw new AppError('Only administrators can manage platform-wide announcements.', 403);
}

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
      const validated: any = await AnnouncementFilterSchema.parseAsync(req.query);

      // Everyone can read global announcements; course/cohort-targeted ones
      // are filtered to the caller's scope for non-admins.
      if (req.user && !isAdminRole(req.user.role)) {
        const scope = await getContentScope(req.user);
        if (scope) validated.accessScope = scope;
      }

      const result = await this.announcementService.listAnnouncements(validated);
      res.status(200).json({
        status: 'success',
        data: {
          docs: result.docs,
          total: result.total,
          page: validated.page,
          limit: validated.limit,
          totalPages: Math.ceil(result.total / validated.limit),
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
      await assertAnnouncementScope(req.user, (validated as any).courseId, (validated as any).cohortId);
      const announcement = await this.announcementService.createAnnouncement(req.user.id, validated as any);
      res.status(201).json({ status: 'success', data: announcement });
    } catch (error) {
      next(error);
    }
  }

  async updateAnnouncement(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const existing = await this.announcementService.getAnnouncementById(req.params.id);
      await assertAnnouncementScope(req.user!, refId(existing.courseId), refId(existing.cohortId));
      const validated = await UpdateAnnouncementSchema.parseAsync(req.body);
      const announcement = await this.announcementService.updateAnnouncement(req.params.id, validated);
      res.status(200).json({ status: 'success', data: announcement });
    } catch (error) {
      next(error);
    }
  }

  async deleteAnnouncement(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const existing = await this.announcementService.getAnnouncementById(req.params.id);
      await assertAnnouncementScope(req.user!, refId(existing.courseId), refId(existing.cohortId));
      await this.announcementService.deleteAnnouncement(req.params.id);
      res.status(200).json({ status: 'success', message: 'Announcement deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
