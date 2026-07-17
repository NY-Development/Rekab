import { z } from 'zod';

export const CreateSessionSchema = z.object({
  courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid course ID'),
  cohortId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid cohort ID'),
  instructorId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid instructor user ID'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  type: z.enum(['LECTURE', 'LAB', 'WORKSHOP', 'STANDUP', 'REVIEW', 'OTHER']).default('LECTURE'),
  sessionDate: z.string().datetime({ message: 'Invalid ISO datetime string' }),
  duration: z.number().int().min(1).default(120),
  meetLink: z.string().url('Invalid Google Meet URL').optional().or(z.literal('')),
  recordingLink: z.string().url('Invalid recording URL').optional().or(z.literal('')),
  status: z.enum(['UPCOMING', 'ACTIVE', 'COMPLETED', 'CANCELLED']).default('UPCOMING'),
});

export const UpdateSessionSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  instructorId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid instructor user ID').optional(),
  type: z.enum(['LECTURE', 'LAB', 'WORKSHOP', 'STANDUP', 'REVIEW', 'OTHER']).optional(),
  sessionDate: z.string().datetime().optional(),
  duration: z.number().int().min(1).optional(),
  meetLink: z.string().url('Invalid Google Meet URL').optional().or(z.literal('')),
  recordingLink: z.string().url('Invalid recording URL').optional().or(z.literal('')),
  status: z.enum(['UPCOMING', 'ACTIVE', 'COMPLETED', 'CANCELLED']).optional(),
});

export const SessionFilterSchema = z.object({
  page: z.string().optional().transform(v => (v ? parseInt(v, 10) : 1)),
  limit: z.string().optional().transform(v => (v ? parseInt(v, 10) : 10)),
  cohortId: z.string().optional(),
  courseId: z.string().optional(),
  instructorId: z.string().optional(),
  status: z.string().optional(),
  sortBy: z.string().optional().default('sessionDate'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});
