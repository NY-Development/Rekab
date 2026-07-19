import api from './axios';
import type { ApiResponse } from '@/types';

export interface Certificate {
  id: string;
  studentId: string;
  courseId: string | { id: string; title?: string };
  cohortId: string | { id: string; name?: string };
  certificateNumber: string;
  issueDate: string;
  pdfUrl?: string;
  credentialUrl?: string;
  metadata?: { studentName?: string; courseTitle?: string; batch?: string };
}

export const certificatesApi = {
  getMine: () => api.get<ApiResponse<Certificate[]>>('/certificates/me'),
};
