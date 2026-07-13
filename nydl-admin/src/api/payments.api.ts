import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/constants';
import type { PaginatedResponse, ApiResponse, Payment } from '@/types';

export const paymentsApi = {
  getAll: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<Payment>>(API_ROUTES.PAYMENTS, { params }),
  getById: (id: string) =>
    api.get<ApiResponse<Payment>>(`${API_ROUTES.PAYMENTS}/${id}`),
  verify: (id: string, data: { status: string; notes?: string }) =>
    api.put<ApiResponse<Payment>>(`${API_ROUTES.PAYMENTS}/${id}/verify`, data),
  delete: (id: string) =>
    api.delete(`${API_ROUTES.PAYMENTS}/${id}`),
};
