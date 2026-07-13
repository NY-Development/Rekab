import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/constants';
import type { PaginatedResponse, ApiResponse, Cohort } from '@/types';

export const cohortsApi = {
  getAll: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<Cohort>>(API_ROUTES.COHORTS, { params }),
  getById: (id: string) =>
    api.get<ApiResponse<Cohort>>(`${API_ROUTES.COHORTS}/${id}`),
  create: (data: Record<string, any>) =>
    api.post<ApiResponse<Cohort>>(API_ROUTES.COHORTS, data),
  update: (id: string, data: Partial<Cohort>) =>
    api.put<ApiResponse<Cohort>>(`${API_ROUTES.COHORTS}/${id}`, data),
  delete: (id: string) =>
    api.delete(`${API_ROUTES.COHORTS}/${id}`),
};
