import api from './axios';
import type { Session, PaginatedResponse } from '@/types';

export const sessionsApi = {
  getAll: (params?: { page?: number; limit?: number; courseId?: string; cohortId?: string; status?: string }) =>
    api.get<PaginatedResponse<Session>>('/sessions', { params }),

  getById: (id: string) =>
    api.get(`/sessions/${id}`),

  create: (data: any) =>
    api.post<any>('/sessions', data),

  update: (id: string, data: any) =>
    api.put<any>(`/sessions/${id}`, data),

  delete: (id: string) =>
    api.delete(`/sessions/${id}`),
};
