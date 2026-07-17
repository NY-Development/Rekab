import api from './axios';
import type { Announcement, PaginatedResponse } from '@/types';

export const announcementsApi = {
  getAll: (params?: { page?: number; limit?: number; courseId?: string; priority?: string }) =>
    api.get<PaginatedResponse<Announcement>>('/announcements', { params }),

  getById: (id: string) =>
    api.get(`/announcements/${id}`),

  create: (data: Partial<Announcement>) =>
    api.post<any>('/announcements', data),

  update: (id: string, data: Partial<Announcement>) =>
    api.put<any>(`/announcements/${id}`, data),

  delete: (id: string) =>
    api.delete(`/announcements/${id}`),
};
