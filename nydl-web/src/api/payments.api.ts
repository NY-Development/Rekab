import api from './axios';
import type { Payment, ApiResponse } from '@/types';

export const paymentsApi = {
  submit: (data: { enrollmentId: string; transactionReference: string; amount: number }) =>
    api.post<ApiResponse<Payment>>('/payments', data),

  getMyPayments: (params?: { page?: number; limit?: number }) =>
    api.get('/payments', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<Payment>>(`/payments/${id}`),
};
