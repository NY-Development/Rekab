import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth';
import { NotificationService } from '../services/notificationService';
import { CreateNotificationSchema, NotificationFilterSchema } from '../validators/notificationValidator';

export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  async getNotificationById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const notification = await this.notificationService.getNotificationById(req.params.id);
      res.status(200).json({ status: 'success', data: notification });
    } catch (error) {
      next(error);
    }
  }

  async getMyNotifications(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }
      const list = await this.notificationService.getUserNotifications(req.user.id);
      res.status(200).json({ status: 'success', data: list });
    } catch (error) {
      next(error);
    }
  }

  async listNotifications(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await NotificationFilterSchema.parseAsync(req.query);
      const result = await this.notificationService.listNotifications(validated);
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

  async createNotification(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await CreateNotificationSchema.parseAsync(req.body);
      const notification = await this.notificationService.createNotification(validated);
      res.status(251).json({ status: 'success', data: notification });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }
      const notification = await this.notificationService.markAsRead(req.params.id, req.user.id);
      res.status(200).json({ status: 'success', data: notification });
    } catch (error) {
      next(error);
    }
  }

  async deleteNotification(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.notificationService.deleteNotification(req.params.id);
      res.status(200).json({ status: 'success', message: 'Notification deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }
      await this.notificationService.markAllAsRead(req.user.id);
      res.status(200).json({ status: 'success', message: 'All notifications marked as read' });
    } catch (error) {
      next(error);
    }
  }
}
