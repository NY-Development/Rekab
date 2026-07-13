import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/constants';
import type { PaginatedResponse, ApiResponse, Assignment } from '@/types';

export const assignmentsApi = {
  getAll: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<Assignment>>(API_ROUTES.ASSIGNMENTS, { params }),
  getById: (id: string) =>
    api.get<ApiResponse<Assignment>>(`${API_ROUTES.ASSIGNMENTS}/${id}`),
  create: (data: Partial<Assignment>) =>
    api.post<ApiResponse<Assignment>>(API_ROUTES.ASSIGNMENTS, data),
  update: (id: string, data: Partial<Assignment>) =>
    api.put<ApiResponse<Assignment>>(`${API_ROUTES.ASSIGNMENTS}/${id}`, data),
  delete: (id: string) =>
    api.delete(`${API_ROUTES.ASSIGNMENTS}/${id}`),
};
