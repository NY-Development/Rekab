import { z } from 'zod';

export const CreateResourceSchema = z.object({
  courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid course ID'),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  resourceType: z.enum(['PDF', 'VIDEO', 'LINK', 'ZIP', 'GITHUB', 'SLIDES']).default('LINK'),
  url: z.string().url('Invalid resource URL'),
});

export const UpdateResourceSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  resourceType: z.enum(['PDF', 'VIDEO', 'LINK', 'ZIP', 'GITHUB', 'SLIDES']).optional(),
  url: z.string().url().optional(),
});

export const ResourceFilterSchema = z.object({
  page: z.string().optional().transform(v => (v ? parseInt(v, 10) : 1)),
  limit: z.string().optional().transform(v => (v ? parseInt(v, 10) : 10)),
  courseId: z.string().optional(),
  resourceType: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});
