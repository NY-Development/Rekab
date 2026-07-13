import api from './axios';
import type { Notification, PaginatedResponse } from '@/types';

export const notificationsApi = {
  getAll: (params?: { page?: number; limit?: number; isRead?: boolean }) =>
    api.get<PaginatedResponse<Notification>>('/notifications', { params }),

  markRead: (id: string) =>
    api.put(`/notifications/${id}/read`),

  markAllRead: () =>
    api.put('/notifications/read-all'),
};
