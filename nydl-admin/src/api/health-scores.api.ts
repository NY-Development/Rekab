import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/constants';
import type { PaginatedResponse, ApiResponse, HealthScore } from '@/types';

export const healthScoresApi = {
  getAll: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<HealthScore>>(API_ROUTES.HEALTH_SCORES, { params }),
  getByStudent: (studentId: string) =>
    api.get<ApiResponse<HealthScore>>(`${API_ROUTES.HEALTH_SCORES}/student/${studentId}`),
  recalculate: (studentId: string) =>
    api.post<ApiResponse<HealthScore>>(`${API_ROUTES.HEALTH_SCORES}/recalculate/${studentId}`),
};
