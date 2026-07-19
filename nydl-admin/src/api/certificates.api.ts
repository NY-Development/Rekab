import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/constants';
import type { PaginatedResponse, ApiResponse, Certificate } from '@/types';

export const certificatesApi = {
  getAll: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<Certificate>>(API_ROUTES.CERTIFICATES, { params }),
  getById: (id: string) =>
    api.get<ApiResponse<Certificate>>(`${API_ROUTES.CERTIFICATES}/${id}`),
  issue: (data: { studentId: string; courseId: string }) =>
    api.post<ApiResponse<Certificate>>(API_ROUTES.CERTIFICATES, data),
  uploadTemplate: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post<ApiResponse<{ templateUrl: string }>>(`${API_ROUTES.CERTIFICATES}/template`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  generate: (data: {
    templateUrl: string;
    courseId: string;
    cohortId: string;
    batch?: string;
    studentIds: string[];
  }) =>
    api.post<ApiResponse<{ issued: Certificate[]; failed: { studentId: string; reason: string }[] }>>(
      `${API_ROUTES.CERTIFICATES}/generate`,
      data
    ),
  delete: (id: string) => api.delete(`${API_ROUTES.CERTIFICATES}/${id}`),
};
