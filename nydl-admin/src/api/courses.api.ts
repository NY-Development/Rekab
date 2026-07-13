import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/constants';
import type { PaginatedResponse, ApiResponse, Course } from '@/types';

export const coursesApi = {
  getAll: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<Course>>(API_ROUTES.COURSES, { params }),
  getById: (id: string) =>
    api.get<ApiResponse<Course>>(`${API_ROUTES.COURSES}/${id}`),
  create: (data: Partial<Course>) =>
    api.post<ApiResponse<Course>>(API_ROUTES.COURSES, data),
  update: (id: string, data: Partial<Course>) =>
    api.put<ApiResponse<Course>>(`${API_ROUTES.COURSES}/${id}`, data),
  delete: (id: string) =>
    api.delete(`${API_ROUTES.COURSES}/${id}`),
};
