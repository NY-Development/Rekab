import { z } from 'zod';

export const CourseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['Frontend', 'Backend', 'DevOps', 'Full-Stack']),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  durationWeeks: z.number().int().positive('Duration must be a positive number'),
  image: z.string().url('Please provide a valid image URL'),
  syllabusSummary: z.string().min(10, 'Syllabus summary must be at least 10 characters')
});

export const ModuleSchema = z.object({
  title: z.string().min(3, 'Module title must be at least 3 characters'),
  description: z.string().min(5, 'Module description must be at least 5 characters'),
  order: z.number().int().nonnegative('Order must be non-negative')
});

export const LessonSchema = z.object({
  title: z.string().min(3, 'Lesson title must be at least 3 characters'),
  content: z.string().min(10, 'Lesson content must be at least 10 characters'),
  durationMinutes: z.number().int().positive('Duration must be positive'),
  videoUrl: z.string().url('Please provide a valid video URL').optional().or(z.literal('')),
  resources: z.array(z.object({
    title: z.string().min(2),
    url: z.string().url()
  })).optional()
});

export const AssignmentSchema = z.object({
  title: z.string().min(3, 'Assignment title must be at least 3 characters'),
  description: z.string().min(10, 'Assignment description must be at least 10 characters'),
  maxPoints: z.number().int().positive('Max points must be positive'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be in YYYY-MM-DD format'),
  submissionType: z.enum(['github', 'text', 'file']).default('github')
});
