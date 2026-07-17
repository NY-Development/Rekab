import api from './axios';
import type { Payment, Cohort, ApiResponse } from '@/types';

export const paymentsApi = {
  submit: (data: {
    enrollmentId: string;
    paymentMethod: 'CBE' | 'TELEBIRR' | 'BOA' | 'CBEBIRR' | 'MPESA' | 'DASHEN' | 'AWASH' | 'SIINQEE' | 'KAAFI_EBIRR' | 'CHAPA' | 'BANK_TRANSFER' | 'CASH';
    transactionReference: string;
    notes?: string;
  }) => api.post<ApiResponse<{ payment: Payment; cohort: Cohort | null }>>('/payments/submit', data),

  getMyPayments: () =>
    api.get<ApiResponse<Payment[]>>('/payments/me'),

  getById: (id: string) =>
    api.get<ApiResponse<Payment>>(`/payments/${id}`),
};
