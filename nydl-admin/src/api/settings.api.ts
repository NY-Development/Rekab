import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/constants';
import type { PaginatedResponse, ApiResponse, SystemSetting } from '@/types';

export const settingsApi = {
  getAll: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<SystemSetting>>(API_ROUTES.SETTINGS, { params }),
  update: (id: string, data: { value: string }) =>
    api.put<ApiResponse<SystemSetting>>(`${API_ROUTES.SETTINGS}/${id}`, data),
};
