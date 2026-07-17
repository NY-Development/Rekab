import api from './axios';
import type { Assignment, PaginatedResponse, ApiResponse, Submission } from '@/types';

export const assignmentsApi = {
  getAll: (params?: { page?: number; limit?: number; courseId?: string; cohortId?: string; status?: string }) =>
    api.get<PaginatedResponse<Assignment>>('/assignments', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<Assignment>>(`/assignments/${id}`),

  create: (data: Partial<Assignment>) =>
    api.post<ApiResponse<Assignment>>('/assignments', data),

  update: (id: string, data: Partial<Assignment>) =>
    api.put<ApiResponse<Assignment>>(`/assignments/${id}`, data),

  delete: (id: string) =>
    api.delete(`/assignments/${id}`),

  submit: (assignmentId: string, data: { content?: string; repoUrl?: string; notes?: string }) =>
    api.post<ApiResponse<{ submission: Submission }>>('/submissions', { assignmentId, ...data }),

  getMySubmissions: () =>
    api.get<ApiResponse<{ submissions: Submission[] }>>('/submissions/mine'),

  // Staff-only: list submissions across students, optionally filtered.
  listSubmissions: (params?: { assignmentId?: string; cohortId?: string; studentId?: string }) =>
    api.get<ApiResponse<{ submissions: (Submission & { studentName?: string; assignmentTitle?: string })[] }>>('/submissions', { params }),

  gradeSubmission: (id: string, data: { points: number; feedback: string }) =>
    api.post<ApiResponse<{ submission: Submission }>>(`/submissions/${id}/grade`, data),
};
