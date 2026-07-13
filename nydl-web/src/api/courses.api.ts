import api from './axios';
import type { Course, PaginatedResponse, ApiResponse } from '@/types';

export const coursesApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string; category?: string; level?: string; status?: string }) =>
    api.get<PaginatedResponse<Course>>('/courses', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<Course>>(`/courses/${id}`),

  getModules: (courseId: string) =>
    api.get<ApiResponse<{ modules: unknown[] }>>(`/curriculum/modules`, { params: { courseId } }),

  getLessons: (moduleId: string) =>
    api.get<ApiResponse<{ lessons: unknown[] }>>(`/curriculum/lessons`, { params: { moduleId } }),
};
