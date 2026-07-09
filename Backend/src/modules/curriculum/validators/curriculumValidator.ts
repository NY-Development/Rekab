import { z } from 'zod';

// --- Curriculum Validators ---
export const CreateCurriculumSchema = z.object({
  courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid course ID'),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  order: z.number().int().min(1),
});

export const UpdateCurriculumSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  order: z.number().int().min(1).optional(),
});

// --- Module Validators ---
export const CreateModuleSchema = z.object({
  courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid course ID'),
  curriculumId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid curriculum ID').optional(),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  order: z.number().int().min(1),
});

export const UpdateModuleSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().min(5).optional(),
  order: z.number().int().min(1).optional(),
  curriculumId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid curriculum ID').optional(),
});

// --- Lesson Validators ---
export const CreateLessonSchema = z.object({
  moduleId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid module ID'),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  lessonType: z.enum(['VIDEO', 'TEXT', 'LIVE', 'PRACTICE', 'QUIZ']).default('TEXT'),
  content: z.string().min(1, 'Content is required'),
  duration: z.number().int().min(1).default(30),
  durationMinutes: z.number().int().min(1).default(30),
  resources: z.array(z.object({
    title: z.string().min(1, 'Resource title required'),
    url: z.string().url('Invalid resource URL'),
  })).optional(),
  order: z.number().int().min(1).default(1),
});

export const UpdateLessonSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  lessonType: z.enum(['VIDEO', 'TEXT', 'LIVE', 'PRACTICE', 'QUIZ']).optional(),
  content: z.string().optional(),
  duration: z.number().int().min(1).optional(),
  durationMinutes: z.number().int().min(1).optional(),
  resources: z.array(z.object({
    title: z.string().min(1),
    url: z.string().url(),
  })).optional(),
  order: z.number().int().min(1).optional(),
});
