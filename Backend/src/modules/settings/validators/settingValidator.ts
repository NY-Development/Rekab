import { z } from 'zod';

export const UpsertSettingSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  value: z.any(),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  isPublic: z.boolean().optional().default(false),
});

export const SettingFilterSchema = z.object({
  category: z.string().optional(),
  isPublic: z.string().optional().transform(v => v === 'true'),
});
