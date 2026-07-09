import { z } from 'zod';

export const UpdateStudentHealthSchema = z.object({
  participationScore: z.number().min(0).max(100).optional(),
  engagementScore: z.number().min(0).max(100).optional(),
  attendanceScore: z.number().min(0).max(100).optional(),
  assignmentScore: z.number().min(0).max(100).optional(),
});

export const HealthFilterSchema = z.object({
  page: z.string().optional().transform(v => (v ? parseInt(v, 10) : 1)),
  limit: z.string().optional().transform(v => (v ? parseInt(v, 10) : 10)),
  studentId: z.string().optional(),
  enrollmentId: z.string().optional(),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  sortBy: z.string().optional().default('overallScore'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});
