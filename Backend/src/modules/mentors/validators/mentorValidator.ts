import { z } from 'zod';

export const CreateMentorProfileSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
  specialization: z.string().optional(),
  availability: z.string().optional(),
  bio: z.string().optional(),
});

export const UpdateMentorProfileSchema = z.object({
  specialization: z.string().optional(),
  assignedTeams: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid team ID')).optional(),
  assignedStudents: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid student/user ID')).optional(),
  availability: z.string().optional(),
  bio: z.string().optional(),
});

export const MentorFilterSchema = z.object({
  page: z.string().optional().transform(v => (v ? parseInt(v, 10) : 1)),
  limit: z.string().optional().transform(v => (v ? parseInt(v, 10) : 10)),
  search: z.string().optional(),
  specialization: z.string().optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});
