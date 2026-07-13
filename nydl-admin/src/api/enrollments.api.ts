import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/constants';
import type { PaginatedResponse, ApiResponse, Enrollment } from '@/types';

export const enrollmentsApi = {
  getAll: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<Enrollment>>(API_ROUTES.ENROLLMENTS, { params }),
  getById: (id: string) =>
    api.get<ApiResponse<Enrollment>>(`${API_ROUTES.ENROLLMENTS}/${id}`),
  update: (id: string, data: Partial<Enrollment>) =>
    api.put<ApiResponse<Enrollment>>(`${API_ROUTES.ENROLLMENTS}/${id}`, data),
  approve: (id: string, notes?: string) =>
    api.patch<ApiResponse<Enrollment>>(`${API_ROUTES.ENROLLMENTS}/${id}/approve`, { notes }),
  reject: (id: string, reason: string, notes?: string) =>
    api.patch<ApiResponse<Enrollment>>(`${API_ROUTES.ENROLLMENTS}/${id}/reject`, { reason, notes }),
  grantAccess: (id: string) =>
    api.patch<ApiResponse<Enrollment>>(`${API_ROUTES.ENROLLMENTS}/${id}/grant-access`, {}),
  suspend: (id: string, notes?: string) =>
    api.patch<ApiResponse<Enrollment>>(`${API_ROUTES.ENROLLMENTS}/${id}/suspend`, { notes }),
  delete: (id: string) =>
    api.delete(`${API_ROUTES.ENROLLMENTS}/${id}`),
};
