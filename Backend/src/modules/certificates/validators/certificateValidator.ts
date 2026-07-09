import { z } from 'zod';

export const IssueCertificateSchema = z.object({
  studentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid student ID'),
  courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid course ID'),
  cohortId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid cohort ID'),
  credentialUrl: z.string().url('Invalid credential URL').optional(),
  pdfUrl: z.string().url('Invalid PDF URL').optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const CertificateFilterSchema = z.object({
  page: z.string().optional().transform(v => (v ? parseInt(v, 10) : 1)),
  limit: z.string().optional().transform(v => (v ? parseInt(v, 10) : 10)),
  studentId: z.string().optional(),
  courseId: z.string().optional(),
  cohortId: z.string().optional(),
  sortBy: z.string().optional().default('issueDate'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});
