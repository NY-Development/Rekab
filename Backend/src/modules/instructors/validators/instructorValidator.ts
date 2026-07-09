import { z } from 'zod';

export const CreateInstructorProfileSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
  specialization: z.string().optional(),
  yearsExperience: z.number().int().min(0).optional(),
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
});

export const UpdateInstructorProfileSchema = z.object({
  specialization: z.string().optional(),
  yearsExperience: z.number().int().min(0).optional(),
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
  assignedCourses: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid course ID')).optional(),
  assignedCohorts: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid cohort ID')).optional(),
  rating: z.number().min(1).max(5).optional(),
  totalStudents: z.number().int().min(0).optional(),
});

export const InstructorFilterSchema = z.object({
  page: z.string().optional().transform(v => (v ? parseInt(v, 10) : 1)),
  limit: z.string().optional().transform(v => (v ? parseInt(v, 10) : 10)),
  search: z.string().optional(),
  specialization: z.string().optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});
