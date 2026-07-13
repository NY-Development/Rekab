import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/constants';
import type { ApiResponse, Submission } from '@/types';

export const submissionsApi = {
  getAll: (params?: { cohortId?: string; studentId?: string; assignmentId?: string }) =>
    api.get<ApiResponse<{ submissions: Submission[] }>>(API_ROUTES.SUBMISSIONS, { params }),
  grade: (id: string, data: { points: number; feedback: string }) =>
    api.post<ApiResponse<Submission>>(`${API_ROUTES.SUBMISSIONS}/${id}/grade`, data),
};
