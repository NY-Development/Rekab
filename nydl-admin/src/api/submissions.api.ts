import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/constants';
import type { PaginatedResponse, ApiResponse, Submission } from '@/types';

export const submissionsApi = {
  getAll: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<Submission>>(API_ROUTES.SUBMISSIONS, { params }),
  getById: (id: string) =>
    api.get<ApiResponse<Submission>>(`${API_ROUTES.SUBMISSIONS}/${id}`),
  grade: (id: string, data: { score: number; feedback: string }) =>
    api.put<ApiResponse<Submission>>(`${API_ROUTES.SUBMISSIONS}/${id}/grade`, data),
};
