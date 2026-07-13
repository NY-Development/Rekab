import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/constants';
import type { PaginatedResponse, ApiResponse, Attendance } from '@/types';

export const attendanceApi = {
  getAll: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<Attendance>>(API_ROUTES.ATTENDANCE, { params }),
  getBySession: (sessionId: string) =>
    api.get<PaginatedResponse<Attendance>>(`${API_ROUTES.ATTENDANCE}`, { params: { sessionId } }),
  mark: (data: { sessionId: string; studentId: string; status: string }) =>
    api.post<ApiResponse<Attendance>>(API_ROUTES.ATTENDANCE, data),
  bulkMark: (data: { sessionId: string; records: { studentId: string; status: string }[] }) =>
    api.post<ApiResponse<any>>(`${API_ROUTES.ATTENDANCE}/bulk`, data),
  update: (id: string, data: Partial<Attendance>) =>
    api.put<ApiResponse<Attendance>>(`${API_ROUTES.ATTENDANCE}/${id}`, data),
};
