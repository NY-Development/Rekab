import { Notification, User } from '../../../types';

export interface NotificationDto extends Notification {
  user?: Partial<User>;
}

export type CreateNotificationDto = Omit<Notification, 'id' | 'isRead' | 'sentAt'>;
