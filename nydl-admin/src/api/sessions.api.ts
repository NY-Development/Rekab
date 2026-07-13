import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/constants';
import type { PaginatedResponse, ApiResponse, Session } from '@/types';

export const sessionsApi = {
  getAll: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<Session>>(API_ROUTES.SESSIONS, { params }),
  getById: (id: string) =>
    api.get<ApiResponse<Session>>(`${API_ROUTES.SESSIONS}/${id}`),
  create: (data: Partial<Session>) =>
    api.post<ApiResponse<Session>>(API_ROUTES.SESSIONS, data),
  update: (id: string, data: Partial<Session>) =>
    api.put<ApiResponse<Session>>(`${API_ROUTES.SESSIONS}/${id}`, data),
  delete: (id: string) =>
    api.delete(`${API_ROUTES.SESSIONS}/${id}`),
};
