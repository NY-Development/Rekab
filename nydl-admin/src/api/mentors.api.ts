import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/constants';
import type { PaginatedResponse, ApiResponse, Mentor } from '@/types';

export const mentorsApi = {
  getAll: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<Mentor>>(API_ROUTES.MENTORS, { params }),
  getById: (id: string) =>
    api.get<ApiResponse<Mentor>>(`${API_ROUTES.MENTORS}/${id}`),
  create: (data: Partial<Mentor>) =>
    api.post<ApiResponse<Mentor>>(API_ROUTES.MENTORS, data),
  update: (id: string, data: Partial<Mentor>) =>
    api.put<ApiResponse<Mentor>>(`${API_ROUTES.MENTORS}/${id}`, data),
  delete: (id: string) =>
    api.delete(`${API_ROUTES.MENTORS}/${id}`),
};
