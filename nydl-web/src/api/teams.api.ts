import api from './axios';
import type { Team, PaginatedResponse, ApiResponse } from '@/types';

export const teamsApi = {
  getAll: (params?: { page?: number; limit?: number; courseId?: string; cohortId?: string }) =>
    api.get<PaginatedResponse<Team>>('/teams', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<Team>>(`/teams/${id}`),

  getMyTeam: () =>
    api.get<ApiResponse<Team>>('/teams/my-team'), // Endpoint to get student's own team (custom/helper)

  create: (data: Partial<Team> & { cohortId: string; name: string; teamCode: string }) =>
    api.post<ApiResponse<Team>>('/teams', data),
  addMember: (id: string, userId: string) =>
    api.post<ApiResponse<Team>>(`/teams/${id}/members`, { userId }),
  removeMember: (id: string, userId: string) =>
    api.delete<ApiResponse<Team>>(`/teams/${id}/members`, { data: { userId } }),
};
