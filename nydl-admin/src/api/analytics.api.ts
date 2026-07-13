import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/constants';
import type { ApiResponse, AnalyticsSummary } from '@/types';

export const analyticsApi = {
  getSummary: () =>
    api.get<ApiResponse<AnalyticsSummary>>(`${API_ROUTES.ANALYTICS}/summary`),
  getEnrollmentTrends: (params?: Record<string, any>) =>
    api.get<ApiResponse<any>>(`${API_ROUTES.ANALYTICS}/enrollment-trends`, { params }),
  getRevenueTrends: (params?: Record<string, any>) =>
    api.get<ApiResponse<any>>(`${API_ROUTES.ANALYTICS}/revenue-trends`, { params }),
};
