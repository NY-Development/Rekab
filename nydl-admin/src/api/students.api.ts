import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/constants';
import type { PaginatedResponse, ApiResponse, StudentProfile } from '@/types';

export const studentsApi = {
  getAll: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<StudentProfile>>(API_ROUTES.STUDENTS, { params }),
  getById: (id: string) =>
    api.get<ApiResponse<StudentProfile>>(`${API_ROUTES.STUDENTS}/${id}`),
  create: (data: Partial<StudentProfile>) =>
    api.post<ApiResponse<StudentProfile>>(API_ROUTES.STUDENTS, data),
  update: (id: string, data: Partial<StudentProfile>) =>
    api.put<ApiResponse<StudentProfile>>(`${API_ROUTES.STUDENTS}/${id}`, data),
  delete: (id: string) =>
    api.delete(`${API_ROUTES.STUDENTS}/${id}`),
};
