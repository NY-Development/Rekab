import api from './axios';
import type { Resource, PaginatedResponse } from '@/types';

export const resourcesApi = {
  getAll: (params?: { page?: number; limit?: number; courseId?: string; type?: string }) =>
    api.get<PaginatedResponse<Resource>>('/resources', { params }),

  getById: (id: string) =>
    api.get(`/resources/${id}`),

  create: (data: FormData | any) =>
    api.post<any>('/resources', data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    }),

  update: (id: string, data: FormData | any) =>
    api.put<any>(`/resources/${id}`, data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    }),

  delete: (id: string) =>
    api.delete(`/resources/${id}`),
};
