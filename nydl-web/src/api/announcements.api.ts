import api from './axios';
import type { Announcement, PaginatedResponse } from '@/types';

export const announcementsApi = {
  getAll: (params?: { page?: number; limit?: number; courseId?: string; priority?: string }) =>
    api.get<PaginatedResponse<Announcement>>('/announcements', { params }),

  getById: (id: string) =>
    api.get(`/announcements/${id}`),
};
