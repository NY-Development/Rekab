import { z } from 'zod';

export const SubmissionSchema = z.object({
  assignmentId: z.string().min(1, 'Assignment ID is required'),
  cohortId: z.string().min(1, 'Cohort ID is required'),
  repoUrl: z.string().url('Please provide a valid GitHub repository URL').optional().or(z.literal('')),
  notes: z.string().optional()
});

export const GradeSchema = z.object({
  points: z.number().int().nonnegative('Points must be a non-negative number'),
  feedback: z.string().min(3, 'Feedback must be at least 3 characters')
});
