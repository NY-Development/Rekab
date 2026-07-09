import { z } from 'zod';

export const SaveAttendanceSchema = z.object({
  studentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid student ID'),
  sessionId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid session ID'),
  enrollmentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid enrollment ID'),
  status: z.enum(['PRESENT', 'LATE', 'ABSENT']).default('PRESENT'),
  checkInTime: z.string().optional(),
  remarks: z.string().optional(),
});

export const BulkAttendanceSchema = z.object({
  sessionId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid session ID'),
  records: z.array(z.object({
    studentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid student ID'),
    enrollmentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid enrollment ID'),
    status: z.enum(['PRESENT', 'LATE', 'ABSENT']),
    remarks: z.string().optional(),
    checkInTime: z.string().optional(),
  })),
});

export const AttendanceFilterSchema = z.object({
  page: z.string().optional().transform(v => (v ? parseInt(v, 10) : 1)),
  limit: z.string().optional().transform(v => (v ? parseInt(v, 10) : 10)),
  studentId: z.string().optional(),
  sessionId: z.string().optional(),
  enrollmentId: z.string().optional(),
  status: z.string().optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});
