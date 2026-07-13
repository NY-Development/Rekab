import api from './axios';
import type { Assignment, PaginatedResponse, ApiResponse, Submission } from '@/types';

export const assignmentsApi = {
  getAll: (params?: { page?: number; limit?: number; courseId?: string; status?: string }) =>
    api.get<PaginatedResponse<Assignment>>('/assignments', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<Assignment>>(`/assignments/${id}`),

  submit: (assignmentId: string, data: { content?: string; fileUrl?: string; linkUrl?: string }) =>
    api.post<ApiResponse<Submission>>(`/assignments/${assignmentId}/submissions`, data),

  getMySubmissions: (params?: { page?: number; limit?: number }) =>
    api.get('/submissions', { params }),
};
