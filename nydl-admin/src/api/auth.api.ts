import api from '@/lib/axios';
import type { ApiResponse, AuthResponse } from '@/types';

export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),

  logout: () =>
    api.post('/auth/logout'),

  getProfile: () =>
    api.get<ApiResponse<{ user: any }>>('/auth/profile'),

  updateProfile: (data: { name?: string; avatar?: string }) =>
    api.put<ApiResponse<{ user: any }>>('/auth/profile', data),
};
