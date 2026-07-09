import { z } from 'zod';

export const LogStudentActivitySchema = z.object({
  action: z.enum([
    'LOGIN', 'LOGOUT', 'JOIN_SESSION', 'SUBMIT_ASSIGNMENT', 'DOWNLOAD_RESOURCE', 'OPEN_COURSE', 'VIEW_ANNOUNCEMENT'
  ]),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const StudentActivityFilterSchema = z.object({
  page: z.string().optional().transform(v => (v ? parseInt(v, 10) : 1)),
  limit: z.string().optional().transform(v => (v ? parseInt(v, 10) : 10)),
  studentId: z.string().optional(),
  action: z.string().optional(),
  sortBy: z.string().optional().default('timestamp'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const ActivityLogFilterSchema = z.object({
  page: z.string().optional().transform(v => (v ? parseInt(v, 10) : 1)),
  limit: z.string().optional().transform(v => (v ? parseInt(v, 10) : 10)),
  userId: z.string().optional(),
  action: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.string().optional().default('timestamp'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});
