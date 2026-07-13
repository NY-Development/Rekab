import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/constants';
import type { PaginatedResponse, ApiResponse, Resource } from '@/types';

export const resourcesApi = {
  getAll: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<Resource>>(API_ROUTES.RESOURCES, { params }),
  getById: (id: string) =>
    api.get<ApiResponse<Resource>>(`${API_ROUTES.RESOURCES}/${id}`),
  create: (data: Partial<Resource>) =>
    api.post<ApiResponse<Resource>>(API_ROUTES.RESOURCES, data),
  update: (id: string, data: Partial<Resource>) =>
    api.put<ApiResponse<Resource>>(`${API_ROUTES.RESOURCES}/${id}`, data),
  delete: (id: string) =>
    api.delete(`${API_ROUTES.RESOURCES}/${id}`),
};
