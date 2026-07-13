import api from './axios';
import type { Enrollment, PaginatedResponse, ApiResponse } from '@/types';

export const enrollmentsApi = {
  getMyEnrollments: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get<PaginatedResponse<Enrollment>>('/enrollments', { params }),

  apply: (data: { courseId: string; cohortId: string }) =>
    api.post<ApiResponse<Enrollment>>('/enrollments', data),

  getById: (id: string) =>
    api.get<ApiResponse<Enrollment>>(`/enrollments/${id}`),
};
