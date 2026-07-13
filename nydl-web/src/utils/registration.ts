import type { Enrollment, Payment } from '@/types';

export type RegistrationStatusTone = 'success' | 'warning' | 'destructive' | 'muted';

export interface RegistrationStatusMeta {
  key: string;
  label: string;
  description: string;
  tone: RegistrationStatusTone;
}

function getEmbeddedPayment(enrollment: Enrollment): Partial<Payment> | undefined {
  const p = enrollment.paymentId as unknown;
  if (p && typeof p === 'object') return p as Partial<Payment>;
  return undefined;
}

/**
 * Derives the student-facing registration status from the enrollment's own
 * status plus its (possibly populated) payment sub-document, since payment
 * verification stages live on the Payment record while approval/access
 * stages live on the Enrollment record.
 */
export function getRegistrationStatusMeta(enrollment: Enrollment): RegistrationStatusMeta {
  const status = (enrollment.status || '').toUpperCase();
  const payment = getEmbeddedPayment(enrollment);

  if (status === 'REJECTED') {
    return {
      key: 'REJECTED',
      label: 'Rejected',
      description: enrollment.rejectionReason || 'Your registration was not approved.',
      tone: 'destructive',
    };
  }
  if (status === 'SUSPENDED') {
    return {
      key: 'SUSPENDED',
      label: 'Access Suspended',
      description: 'Your course access has been suspended. Please contact support.',
      tone: 'destructive',
    };
  }
  if (status === 'ACTIVE') {
    return {
      key: 'ACTIVE',
      label: 'Course Access Granted',
      description: 'You have full access to assignments, resources, sessions, and announcements.',
      tone: 'success',
    };
  }
  if (status === 'COMPLETED') {
    return {
      key: 'COMPLETED',
      label: 'Course Completed',
      description: 'You have successfully completed this course.',
      tone: 'success',
    };
  }
  if (status === 'APPROVED') {
    return {
      key: 'APPROVED',
      label: 'Approved',
      description: 'Your registration was approved. Course access will be granted shortly.',
      tone: 'success',
    };
  }
  if (status === 'PENDING_APPROVAL') {
    return {
      key: 'PENDING_APPROVAL',
      label: 'Pending Approval',
      description: 'Your payment has been verified. An admin is reviewing your registration.',
      tone: 'warning',
    };
  }
  if (status === 'DROPPED' || status === 'REMOVED') {
    return {
      key: 'DROPPED',
      label: 'Dropped',
      description: 'This registration is no longer active.',
      tone: 'muted',
    };
  }

  // status === 'PENDING' (pre-approval): derive from payment sub-state
  if (payment?.status === 'FAILED') {
    return {
      key: 'PAYMENT_FAILED',
      label: 'Payment Failed',
      description: 'Your last payment could not be verified. Please resubmit a valid transaction reference.',
      tone: 'destructive',
    };
  }
  if (payment?.status === 'PENDING') {
    return {
      key: 'PAYMENT_SUBMITTED',
      label: 'Payment Submitted',
      description: 'Your payment reference has been submitted and is awaiting verification.',
      tone: 'warning',
    };
  }
  return {
    key: 'PENDING_PAYMENT',
    label: 'Pending Payment',
    description: 'Please complete payment to continue your registration.',
    tone: 'warning',
  };
}
