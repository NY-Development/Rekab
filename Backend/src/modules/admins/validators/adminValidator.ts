import { z } from 'zod';

export const EmptySchema = z.object({});

export const UserFilterSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  role: z.string().optional(),
});

export const AdminCreateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'INSTRUCTOR', 'MENTOR', 'STUDENT']).default('STUDENT'),
});

export const AdminUpdateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'INSTRUCTOR', 'MENTOR', 'STUDENT']).optional(),
  isActive: z.boolean().optional(),
  isBlocked: z.boolean().optional(),
  blockReason: z.string().optional(),
});
