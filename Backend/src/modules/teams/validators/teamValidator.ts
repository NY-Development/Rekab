import { z } from 'zod';

export const CreateTeamSchema = z.object({
  cohortId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid cohort ID'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  teamCode: z.string().min(3, 'Team code must be at least 3 characters'),
  mentorId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid mentor ID').optional(),
  leaderId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid leader ID').optional(),
  maxMembers: z.number().int().min(1).default(5),
  memberIds: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid member user ID')).optional(),
});

export const UpdateTeamSchema = z.object({
  name: z.string().min(2).optional(),
  mentorId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid mentor ID').optional(),
  leaderId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid leader ID').optional(),
  maxMembers: z.number().int().min(1).optional(),
  memberIds: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid member user ID')).optional(),
  score: z.number().optional(),
});

export const TeamFilterSchema = z.object({
  page: z.string().optional().transform(v => (v ? parseInt(v, 10) : 1)),
  limit: z.string().optional().transform(v => (v ? parseInt(v, 10) : 10)),
  search: z.string().optional(),
  cohortId: z.string().optional(),
  mentorId: z.string().optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});
