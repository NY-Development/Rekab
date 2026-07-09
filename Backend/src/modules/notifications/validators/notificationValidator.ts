import { z } from 'zod';

export const CreateNotificationSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  message: z.string().min(3, 'Message must be at least 3 characters'),
  type: z.string().optional(),
  actionUrl: z.string().url('Invalid action URL').optional().or(z.literal('')),
});

export const NotificationFilterSchema = z.object({
  page: z.string().optional().transform(v => (v ? parseInt(v, 10) : 1)),
  limit: z.string().optional().transform(v => (v ? parseInt(v, 10) : 10)),
  userId: z.string().optional(),
  isRead: z.string().optional().transform(v => v === 'true'),
  sortBy: z.string().optional().default('sentAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});
