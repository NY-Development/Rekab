import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/constants';
import type { PaginatedResponse, ApiResponse, User } from '@/types';

export const usersApi = {
  getAll: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<User>>(API_ROUTES.USERS, { params }),
  getById: (id: string) =>
    api.get<ApiResponse<User>>(`${API_ROUTES.USERS}/${id}`),
  create: (data: Partial<User>) =>
    api.post<ApiResponse<User>>(API_ROUTES.USERS, data),
  update: (id: string, data: Partial<User>) =>
    api.put<ApiResponse<User>>(`${API_ROUTES.USERS}/${id}`, data),
  delete: (id: string) =>
    api.delete(`${API_ROUTES.USERS}/${id}`),
};
