import api from './axios';
import type { Payment, ApiResponse } from '@/types';

export const paymentsApi = {
  submit: (data: {
    enrollmentId: string;
    paymentMethod: 'CHAPA' | 'TELEBIRR' | 'BANK_TRANSFER' | 'CASH';
    transactionReference: string;
    notes?: string;
  }) => api.post<ApiResponse<Payment>>('/payments/submit', data),

  getMyPayments: () =>
    api.get<ApiResponse<Payment[]>>('/payments/me'),

  getById: (id: string) =>
    api.get<ApiResponse<Payment>>(`/payments/${id}`),
};
