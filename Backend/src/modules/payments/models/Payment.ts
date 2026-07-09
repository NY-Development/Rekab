import mongoose, { Schema, Document } from 'mongoose';
import { Payment } from '../../../types';

export interface IPaymentDocument extends Omit<Payment, 'id'>, Document {}

const PaymentSchema = new Schema<IPaymentDocument>({
  studentId: { type: Schema.Types.ObjectId as any, ref: 'User', required: true, index: true },
  enrollmentId: { type: Schema.Types.ObjectId as any, ref: 'Enrollment', index: true },
  courseId: { type: Schema.Types.ObjectId as any, ref: 'Course', required: true, index: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'ETB' },
  paymentMethod: { 
    type: String, 
    enum: ['CHAPA', 'TELEBIRR', 'BANK_TRANSFER', 'CASH'], 
    required: true 
  },
  transactionReference: { type: String },
  screenshot: { type: String },
  paidAt: { type: String },
  verifiedBy: { type: Schema.Types.ObjectId as any, ref: 'User' },
  verificationDate: { type: String },
  notes: { type: String },
  status: { type: String, enum: ['PENDING', 'VERIFIED', 'FAILED'], default: 'PENDING' },
  createdAt: { type: String, default: () => new Date().toISOString() },
  updatedAt: { type: String, default: () => new Date().toISOString() }
}, {
  toJSON: {
    transform: (doc, ret: any) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

export const PaymentModel = mongoose.models.Payment || mongoose.model<IPaymentDocument>('Payment', PaymentSchema);
export default PaymentModel;
