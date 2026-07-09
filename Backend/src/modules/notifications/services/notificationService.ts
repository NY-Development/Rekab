import { NotificationRepository } from '../repositories/notificationRepository';
import { CreateNotificationDto } from '../dtos/notificationDto';
import { Notification } from '../../../types';
import { AppError } from '../../../middlewares/errorHandler';

export class NotificationService {
  constructor(private notificationRepository: NotificationRepository) {}

  async getNotificationById(id: string): Promise<Notification> {
    const notification = await this.notificationRepository.findById(id);
    if (!notification) {
      throw new AppError('Notification not found', 404);
    }
    return notification;
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return this.notificationRepository.findByUserId(userId);
  }

  async createNotification(data: CreateNotificationDto): Promise<Notification> {
    return this.notificationRepository.create(data);
  }

  async markAsRead(id: string, userId: string): Promise<Notification> {
    const notification = await this.notificationRepository.findById(id);
    if (!notification) {
      throw new AppError('Notification not found', 404);
    }
    if (notification.userId.toString() !== userId) {
      throw new AppError('Unauthorized access to notification', 403);
    }
    const updated = await this.notificationRepository.markAsRead(id);
    if (!updated) {
      throw new AppError('Failed to mark notification as read', 500);
    }
    return updated;
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.markAllAsRead(userId);
  }

  async listNotifications(filters: {
    page: number;
    limit: number;
    userId?: string;
    isRead?: boolean;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<{ docs: Notification[]; total: number }> {
    return this.notificationRepository.findPaginated(filters);
  }
}
