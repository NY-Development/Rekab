import api from './axios';
import type { Session, PaginatedResponse } from '@/types';

export const sessionsApi = {
  getAll: (params?: { page?: number; limit?: number; courseId?: string; cohortId?: string; status?: string }) =>
    api.get<PaginatedResponse<Session>>('/sessions', { params }),

  getById: (id: string) =>
    api.get(`/sessions/${id}`),
};
