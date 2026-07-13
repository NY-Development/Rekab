import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/constants';
import type { PaginatedResponse, ApiResponse, Enrollment } from '@/types';

export const enrollmentsApi = {
  getAll: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<Enrollment>>(API_ROUTES.ENROLLMENTS, { params }),
  getById: (id: string) =>
    api.get<ApiResponse<Enrollment>>(`${API_ROUTES.ENROLLMENTS}/${id}`),
  create: (data: Partial<Enrollment>) =>
    api.post<ApiResponse<Enrollment>>(API_ROUTES.ENROLLMENTS, data),
  update: (id: string, data: Partial<Enrollment>) =>
    api.put<ApiResponse<Enrollment>>(`${API_ROUTES.ENROLLMENTS}/${id}`, data),
  delete: (id: string) =>
    api.delete(`${API_ROUTES.ENROLLMENTS}/${id}`),
};
