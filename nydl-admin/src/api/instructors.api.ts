import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/constants';
import type { PaginatedResponse, ApiResponse, Instructor } from '@/types';

export const instructorsApi = {
  getAll: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<Instructor>>(API_ROUTES.INSTRUCTORS, { params }),
  getById: (id: string) =>
    api.get<ApiResponse<Instructor>>(`${API_ROUTES.INSTRUCTORS}/${id}`),
  create: (data: Partial<Instructor>) =>
    api.post<ApiResponse<Instructor>>(API_ROUTES.INSTRUCTORS, data),
  update: (id: string, data: Partial<Instructor>) =>
    api.put<ApiResponse<Instructor>>(`${API_ROUTES.INSTRUCTORS}/${id}`, data),
  delete: (id: string) =>
    api.delete(`${API_ROUTES.INSTRUCTORS}/${id}`),
};
