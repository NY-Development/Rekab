import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/constants';
import type { ApiResponse, SystemSetting } from '@/types';

export const settingsApi = {
  getAll: () =>
    api.get<{ status: string; data: SystemSetting[] }>(API_ROUTES.SETTINGS),
  update: (data: { key: string; value: string; category: string; description?: string }) =>
    api.put<ApiResponse<SystemSetting>>(API_ROUTES.SETTINGS, data),
};
