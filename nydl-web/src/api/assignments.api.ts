import api from './axios';
import type { Assignment, PaginatedResponse, ApiResponse, Submission } from '@/types';

export const assignmentsApi = {
  getAll: (params?: { page?: number; limit?: number; courseId?: string; status?: string }) =>
    api.get<PaginatedResponse<Assignment>>('/assignments', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<Assignment>>(`/assignments/${id}`),

  submit: (assignmentId: string, data: { content?: string; repoUrl?: string; notes?: string }) =>
    api.post<ApiResponse<{ submission: Submission }>>('/submissions', { assignmentId, ...data }),

  getMySubmissions: () =>
    api.get<ApiResponse<{ submissions: Submission[] }>>('/submissions/mine'),
};
