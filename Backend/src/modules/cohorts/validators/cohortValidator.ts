import { z } from 'zod';

export const CohortSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  name: z.string().min(3, 'Cohort name must be at least 3 characters'),
  code: z.string().min(3, 'Cohort code must be at least 3 characters'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format'),
  maxCapacity: z.number().int().positive('Max capacity must be a positive number'),
  instructors: z.array(z.string()).min(1, 'At least one instructor is required'),
  schedule: z.string().min(3, 'Schedule description is required')
});
