import type { Enrollment, Payment } from '@/types';

export type RegistrationStatusTone = 'success' | 'warning' | 'destructive' | 'muted';

export interface RegistrationStatusMeta {
  key: string;
  label: string;
  tone: RegistrationStatusTone;
}

export function getPopulatedPayment(enrollment: Enrollment): (Partial<Payment> & { id: string }) | undefined {
  const p = enrollment.paymentId;
  if (p && typeof p === 'object') return p;
  return undefined;
}

export function getPopulated<T extends { id: string }>(field: string | (Partial<T> & { id: string }) | undefined): (Partial<T> & { id: string }) | undefined {
  if (field && typeof field === 'object') return field;
  return undefined;
}

/**
 * Derives the admin-facing registration status from the enrollment's own
 * status plus its (possibly populated) payment sub-document.
 */
export function getRegistrationStatusMeta(enrollment: Enrollment): RegistrationStatusMeta {
  const status = (enrollment.status || '').toUpperCase();
  const payment = getPopulatedPayment(enrollment);

  if (status === 'REJECTED') return { key: 'REJECTED', label: 'Rejected', tone: 'destructive' };
  if (status === 'SUSPENDED') return { key: 'SUSPENDED', label: 'Suspended', tone: 'destructive' };
  if (status === 'ACTIVE') return { key: 'ACTIVE', label: 'Course Access Granted', tone: 'success' };
  if (status === 'COMPLETED') return { key: 'COMPLETED', label: 'Completed', tone: 'success' };
  if (status === 'APPROVED') return { key: 'APPROVED', label: 'Approved', tone: 'success' };
  if (status === 'PENDING_APPROVAL') return { key: 'PENDING_APPROVAL', label: 'Pending Approval', tone: 'warning' };
  if (status === 'DROPPED' || status === 'REMOVED') return { key: 'DROPPED', label: 'Dropped', tone: 'muted' };

  if (payment?.status === 'FAILED') return { key: 'PAYMENT_FAILED', label: 'Payment Failed', tone: 'destructive' };
  if (payment?.status === 'PENDING') return { key: 'PAYMENT_SUBMITTED', label: 'Payment Submitted', tone: 'warning' };
  return { key: 'PENDING_PAYMENT', label: 'Pending Payment', tone: 'warning' };
}

export const REGISTRATION_STATUS_FILTERS = [
  { value: 'PENDING', label: 'Pending Payment' },
  { value: 'PENDING_APPROVAL', label: 'Pending Approval' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'ACTIVE', label: 'Course Access Granted' },
  { value: 'SUSPENDED', label: 'Suspended' },
  { value: 'COMPLETED', label: 'Completed' },
];

export const PAYMENT_STATUS_FILTERS = [
  { value: 'NONE', label: 'No Payment Yet' },
  { value: 'PENDING', label: 'Submitted (Pending)' },
  { value: 'VERIFIED', label: 'Verified' },
  { value: 'FAILED', label: 'Failed' },
];
