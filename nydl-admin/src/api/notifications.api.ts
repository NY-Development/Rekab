import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/constants';
import type { PaginatedResponse, ApiResponse, Notification } from '@/types';

export const notificationsApi = {
  getAll: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<Notification>>(API_ROUTES.NOTIFICATIONS, { params }),
  send: (data: { userId: string; title: string; message: string; type: string }) =>
    api.post<ApiResponse<Notification>>(API_ROUTES.NOTIFICATIONS, data),
  delete: (id: string) =>
    api.delete(`${API_ROUTES.NOTIFICATIONS}/${id}`),
};
