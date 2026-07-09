import { z } from 'zod';

export const CreateAnnouncementSchema = z.object({
  courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid course ID').optional(),
  cohortId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid cohort ID').optional(),
  teamId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid team ID').optional(),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(5, 'Content must be at least 5 characters'),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).default('NORMAL'),
  publishDate: z.string().datetime({ message: 'Invalid ISO datetime string' }).optional(),
});

export const UpdateAnnouncementSchema = z.object({
  title: z.string().min(3).optional(),
  content: z.string().min(5).optional(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).optional(),
  publishDate: z.string().datetime().optional(),
});

export const AnnouncementFilterSchema = z.object({
  page: z.string().optional().transform(v => (v ? parseInt(v, 10) : 1)),
  limit: z.string().optional().transform(v => (v ? parseInt(v, 10) : 10)),
  courseId: z.string().optional(),
  cohortId: z.string().optional(),
  teamId: z.string().optional(),
  priority: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.string().optional().default('publishDate'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});
