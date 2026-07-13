import api from './axios';
import type { AuthResponse, ApiResponse, User } from '@/types';

export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),

  signup: (data: { name: string; email: string; password: string; role: string }) =>
    api.post<AuthResponse>('/auth/signup', data),

  getProfile: () =>
    api.get<ApiResponse<{ user: User }>>('/auth/profile'),

  updateProfile: (data: { name?: string; avatar?: string }) =>
    api.put<ApiResponse<{ user: User }>>('/auth/profile', data),
};
