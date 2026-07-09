import { Payment, User, Course, Enrollment } from '../../../types';

export interface PaymentDto extends Payment {
  student?: Partial<User>;
  course?: Partial<Course>;
  enrollment?: Partial<Enrollment>;
}

export type SubmitPaymentDto = {
  enrollmentId: string;
  paymentMethod: 'CHAPA' | 'TELEBIRR' | 'BANK_TRANSFER' | 'CASH';
  transactionReference: string;
  notes?: string;
};

export type AdminVerifyPaymentDto = {
  status: 'PENDING' | 'VERIFIED' | 'FAILED';
  notes?: string;
};
