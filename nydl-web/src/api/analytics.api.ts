import api from './axios';

export const analyticsApi = {
  getStudentActivity: (params?: { page?: number; limit?: number }) =>
    api.get('/analytics/student-activity', { params }),

  logActivity: (data: { action: string; metadata?: Record<string, unknown> }) =>
    api.post('/analytics/activity', data),
};
