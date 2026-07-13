import api from './axios';
import type { Resource, PaginatedResponse } from '@/types';

export const resourcesApi = {
  getAll: (params?: { page?: number; limit?: number; courseId?: string; type?: string }) =>
    api.get<PaginatedResponse<Resource>>('/resources', { params }),

  getById: (id: string) =>
    api.get(`/resources/${id}`),
};
