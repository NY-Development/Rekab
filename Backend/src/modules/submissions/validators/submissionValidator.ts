import { z } from 'zod';

export const SubmissionSchema = z.object({
  assignmentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid assignment ID'),
  repoUrl: z.string().url('Please provide a valid GitHub repository URL').optional().or(z.literal('')),
  content: z.string().optional(),
  notes: z.string().optional()
});

export const GradeSchema = z.object({
  points: z.number().int().nonnegative('Points must be a non-negative number'),
  feedback: z.string().min(3, 'Feedback must be at least 3 characters')
});
