import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/constants';
import type { PaginatedResponse, ApiResponse } from '@/types';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  topic?: string;
  message: string;
  userId?: string;
  status: 'NEW' | 'HANDLED';
  handledBy?: string;
  handledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const contactsApi = {
  getAll: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<ContactMessage>>(API_ROUTES.CONTACTS, { params }),
  unreadCount: () =>
    api.get<ApiResponse<{ count: number }>>(`${API_ROUTES.CONTACTS}/unread-count`),
  markHandled: (id: string) =>
    api.patch<ApiResponse<ContactMessage>>(`${API_ROUTES.CONTACTS}/${id}/handled`),
};
