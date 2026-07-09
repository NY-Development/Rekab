import { z } from 'zod';

export const CreateStudentProfileSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
  studentCode: z.string().min(3, 'Student code must be at least 3 characters'),
  currentLevel: z.string().optional(),
  github: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  portfolio: z.string().url('Invalid Portfolio URL').optional().or(z.literal('')),
  interests: z.array(z.string()).optional(),
  experienceLevel: z.string().optional(),
});

export const UpdateStudentProfileSchema = z.object({
  currentLevel: z.string().optional(),
  github: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  portfolio: z.string().url('Invalid Portfolio URL').optional().or(z.literal('')),
  interests: z.array(z.string()).optional(),
  experienceLevel: z.string().optional(),
  graduationStatus: z.string().optional(),
});

export const StudentFilterSchema = z.object({
  page: z.string().optional().transform(v => (v ? parseInt(v, 10) : 1)),
  limit: z.string().optional().transform(v => (v ? parseInt(v, 10) : 10)),
  search: z.string().optional(),
  currentLevel: z.string().optional(),
  graduationStatus: z.string().optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});
