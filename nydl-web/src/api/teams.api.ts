import api from './axios';
import type { Team, PaginatedResponse, ApiResponse } from '@/types';

export const teamsApi = {
  getAll: (params?: { page?: number; limit?: number; courseId?: string; cohortId?: string }) =>
    api.get<PaginatedResponse<Team>>('/teams', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<Team>>(`/teams/${id}`),

  getMyTeam: () =>
    api.get<ApiResponse<Team>>('/teams/my-team'), // Endpoint to get student's own team (custom/helper)
};
