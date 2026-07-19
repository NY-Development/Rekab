import { z } from 'zod';

export const SubmitPaymentSchema = z.object({
  enrollmentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid enrollment ID'),
  paymentMethod: z.enum(['CBE', 'TELEBIRR', 'BOA', 'CBEBIRR', 'MPESA', 'DASHEN', 'AWASH', 'SIINQEE', 'KAAFI_EBIRR', 'CHAPA', 'BANK_TRANSFER', 'CASH']),
  transactionReference: z.string().min(4, 'Transaction reference must be at least 4 characters'),
  notes: z.string().optional(),
});

export const AdminVerifyPaymentSchema = z.object({
  status: z.enum(['PENDING', 'VERIFIED', 'FAILED', 'PARTIAL_PAYMENT']),
  notes: z.string().optional(),
});

export const PaymentFilterSchema = z.object({
  page: z.string().optional().transform(v => (v ? parseInt(v, 10) : 1)),
  limit: z.string().optional().transform(v => (v ? parseInt(v, 10) : 10)),
  studentId: z.string().optional(),
  courseId: z.string().optional(),
  enrollmentId: z.string().optional(),
  status: z.string().optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});
