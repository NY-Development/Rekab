import api from './axios';
import type { ApiResponse } from '@/types';

export interface AttendanceRecord {
  id: string;
  studentId: string | { id: string; name?: string; email?: string; avatar?: string };
  sessionId: string | { id: string; title?: string; duration?: number };
  status: 'PRESENT' | 'PARTIAL' | 'LATE' | 'ABSENT' | string;
  durationSeconds?: number;
  presenceRatio?: number;
  source?: string;
  checkInTime?: string;
  createdAt: string;
}

export const attendanceApi = {
  /** Student: record clicking a session's join link. Fire-and-forget. */
  recordJoin: (sessionId: string) => api.post<ApiResponse<AttendanceRecord>>('/attendance/join', { sessionId }),

  /** My own attendance across sessions. */
  getMine: () => api.get<ApiResponse<AttendanceRecord[]>>('/attendance/me'),

  /** Instructor/admin: attendance for a session. */
  getForSession: (sessionId: string) => api.get<ApiResponse<AttendanceRecord[]>>(`/attendance/session/${sessionId}`),

  /** Instructor/admin: upload a Meet attendance report (CSV/XLSX). */
  importForSession: (sessionId: string, file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post<ApiResponse<{ imported: number; unmatched: string[] }>>(
      `/attendance/session/${sessionId}/import`,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  },
};
