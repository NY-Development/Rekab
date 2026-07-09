import { z } from 'zod';

export const CreateEnrollmentSchema = z.object({
  studentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid student ID'),
  courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid course ID'),
  cohortId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid cohort ID'),
});

export const UpdateEnrollmentSchema = z.object({
  teamId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid team ID').optional().nullable(),
  paymentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid payment ID').optional().nullable(),
  progressPercentage: z.number().min(0).max(100).optional(),
  certificateIssued: z.boolean().optional(),
  certificateUrl: z.string().url('Invalid certificate URL').optional().or(z.literal('')),
  completedAt: z.string().optional().nullable(),
  status: z.enum(['PENDING', 'APPROVED', 'ACTIVE', 'COMPLETED', 'DROPPED', 'REMOVED', 'enrolled', 'completed', 'dropped']).optional(),
});

export const EnrollmentFilterSchema = z.object({
  page: z.string().optional().transform(v => (v ? parseInt(v, 10) : 1)),
  limit: z.string().optional().transform(v => (v ? parseInt(v, 10) : 10)),
  studentId: z.string().optional(),
  courseId: z.string().optional(),
  cohortId: z.string().optional(),
  status: z.string().optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});
