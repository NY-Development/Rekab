import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/constants';
import type { PaginatedResponse, ApiResponse, Team } from '@/types';

export const teamsApi = {
  getAll: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<Team>>(API_ROUTES.TEAMS, { params }),
  getById: (id: string) =>
    api.get<ApiResponse<Team>>(`${API_ROUTES.TEAMS}/${id}`),
  create: (data: Partial<Team>) =>
    api.post<ApiResponse<Team>>(API_ROUTES.TEAMS, data),
  update: (id: string, data: Partial<Team>) =>
    api.put<ApiResponse<Team>>(`${API_ROUTES.TEAMS}/${id}`, data),
  delete: (id: string) =>
    api.delete(`${API_ROUTES.TEAMS}/${id}`),
  addMember: (id: string, userId: string) =>
    api.post<ApiResponse<Team>>(`${API_ROUTES.TEAMS}/${id}/members`, { userId }),
  removeMember: (id: string, userId: string) =>
    api.delete<ApiResponse<Team>>(`${API_ROUTES.TEAMS}/${id}/members`, { data: { userId } }),
};
