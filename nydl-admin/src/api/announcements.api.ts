import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/constants';
import type { PaginatedResponse, ApiResponse, Announcement } from '@/types';

export const announcementsApi = {
  getAll: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<Announcement>>(API_ROUTES.ANNOUNCEMENTS, { params }),
  getById: (id: string) =>
    api.get<ApiResponse<Announcement>>(`${API_ROUTES.ANNOUNCEMENTS}/${id}`),
  create: (data: Partial<Announcement>) =>
    api.post<ApiResponse<Announcement>>(API_ROUTES.ANNOUNCEMENTS, data),
  update: (id: string, data: Partial<Announcement>) =>
    api.put<ApiResponse<Announcement>>(`${API_ROUTES.ANNOUNCEMENTS}/${id}`, data),
  delete: (id: string) =>
    api.delete(`${API_ROUTES.ANNOUNCEMENTS}/${id}`),
};
