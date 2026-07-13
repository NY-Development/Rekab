import api from './axios';
import type { ApiResponse, User } from '@/types';

export const profileApi = {
  getProfile: () =>
    api.get<ApiResponse<{ user: User }>>('/auth/profile'),

  updateProfile: (data: { name?: string; avatar?: string; phone?: string }) =>
    api.put<ApiResponse<{ user: User }>>('/auth/profile', data),

  getStudentProfile: () =>
    api.get('/students/me'),
};
