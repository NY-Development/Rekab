import { z } from 'zod';

export const CreateAssignmentSchema = z.object({
  courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid course ID'),
  cohortId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid cohort ID'),
  moduleId: z.string().min(1, 'Module ID is required'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  assignmentType: z.enum(['INDIVIDUAL', 'TEAM']).default('INDIVIDUAL'),
  maxScore: z.number().int().min(1).default(100),
  maxPoints: z.number().int().min(1),
  dueDate: z.string().datetime({ message: 'Invalid ISO datetime string' }),
  submissionType: z.enum(['github', 'text', 'file']).default('github'),
  attachments: z.array(z.string().url('Invalid attachment URL')).optional(),
  rubric: z.string().optional(),
});

export const UpdateAssignmentSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(5).optional(),
  assignmentType: z.enum(['INDIVIDUAL', 'TEAM']).optional(),
  maxScore: z.number().int().min(1).optional(),
  maxPoints: z.number().int().min(1).optional(),
  dueDate: z.string().datetime().optional(),
  submissionType: z.enum(['github', 'text', 'file']).optional(),
  attachments: z.array(z.string().url()).optional(),
  rubric: z.string().optional(),
});

export const AssignmentFilterSchema = z.object({
  page: z.string().optional().transform(v => (v ? parseInt(v, 10) : 1)),
  limit: z.string().optional().transform(v => (v ? parseInt(v, 10) : 10)),
  cohortId: z.string().optional(),
  courseId: z.string().optional(),
  moduleId: z.string().optional(),
  assignmentType: z.string().optional(),
  sortBy: z.string().optional().default('dueDate'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});
