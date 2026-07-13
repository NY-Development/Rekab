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
};
