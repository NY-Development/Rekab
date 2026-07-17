import { Payment, User, Course, Enrollment } from '../../../types';

export interface PaymentDto extends Payment {
  student?: Partial<User>;
  course?: Partial<Course>;
  enrollment?: Partial<Enrollment>;
}

export type SubmitPaymentDto = {
  enrollmentId: string;
  paymentMethod: 'CBE' | 'TELEBIRR' | 'BOA' | 'CBEBIRR' | 'MPESA' | 'DASHEN' | 'AWASH' | 'SIINQEE' | 'KAAFI_EBIRR' | 'CHAPA' | 'BANK_TRANSFER' | 'CASH';
  transactionReference: string;
  notes?: string;
};

export type AdminVerifyPaymentDto = {
  status: 'PENDING' | 'VERIFIED' | 'FAILED';
  notes?: string;
};
