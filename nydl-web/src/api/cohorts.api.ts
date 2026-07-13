import api from './axios';
import type { Cohort, PaginatedResponse } from '@/types';

export const cohortsApi = {
  getAll: (params?: { page?: number; limit?: number; courseId?: string }) =>
    api.get<PaginatedResponse<Cohort>>('/cohorts', { params }),
};
