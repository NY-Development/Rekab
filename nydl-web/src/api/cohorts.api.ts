import api from './axios';
import type { Cohort, Team, PaginatedResponse, ApiResponse } from '@/types';

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
  getAll: (params?: { page?: number; limit?: number; courseId?: string }) =>
    api.get<PaginatedResponse<Cohort>>('/cohorts', { params }),
  getRoster: (id: string) =>
    api.get<ApiResponse<CohortRoster>>(`/cohorts/${id}/roster`),
};
