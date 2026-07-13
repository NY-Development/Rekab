import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/constants';
import type { PaginatedResponse, ApiResponse, CurriculumModule } from '@/types';

export const curriculumApi = {
  getAll: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<CurriculumModule>>(API_ROUTES.CURRICULUM, { params }),
  getByCourse: (courseId: string) =>
    api.get<ApiResponse<{ modules: CurriculumModule[] }>>(`${API_ROUTES.COURSES}/${courseId}/modules`),
  create: (data: Partial<CurriculumModule>) =>
    api.post<ApiResponse<CurriculumModule>>(API_ROUTES.CURRICULUM, data),
  update: (id: string, data: Partial<CurriculumModule>) =>
    api.put<ApiResponse<CurriculumModule>>(`${API_ROUTES.CURRICULUM}/${id}`, data),
  delete: (id: string) =>
    api.delete(`${API_ROUTES.CURRICULUM}/${id}`),
};
