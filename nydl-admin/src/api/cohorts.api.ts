import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/constants';
import type { PaginatedResponse, ApiResponse, Cohort, Team } from '@/types';

export interface RosterStudent {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  role?: string;
}

export interface CohortRoster {
  cohort: Cohort;
  students: RosterStudent[];
  teams: Team[];
}

export const cohortsApi = {
  getAll: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<Cohort>>(API_ROUTES.COHORTS, { params }),
  getById: (id: string) =>
    api.get<ApiResponse<Cohort>>(`${API_ROUTES.COHORTS}/${id}`),
  getRoster: (id: string) =>
    api.get<ApiResponse<CohortRoster>>(`${API_ROUTES.COHORTS}/${id}/roster`),
  create: (data: Record<string, any>) =>
    api.post<ApiResponse<Cohort>>(API_ROUTES.COHORTS, data),
  update: (id: string, data: Partial<Cohort>) =>
    api.put<ApiResponse<Cohort>>(`${API_ROUTES.COHORTS}/${id}`, data),
  delete: (id: string) =>
    api.delete(`${API_ROUTES.COHORTS}/${id}`),
};
