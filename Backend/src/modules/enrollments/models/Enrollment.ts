import mongoose, { Schema, Document } from 'mongoose';
import { Enrollment as EnrollmentType } from '../../../types';

export interface IEnrollmentDocument extends Omit<EnrollmentType, 'id'>, Document {}

const EnrollmentSchema = new Schema<IEnrollmentDocument>({
  studentId: { type: Schema.Types.ObjectId as any, ref: 'User', required: true, index: true },
  courseId: { type: Schema.Types.ObjectId as any, ref: 'Course', index: true },
  cohortId: { type: Schema.Types.ObjectId as any, ref: 'Cohort', required: true, index: true },
  teamId: { type: Schema.Types.ObjectId as any, ref: 'Team' },
  paymentId: { type: Schema.Types.ObjectId as any, ref: 'Payment' },
  progressPercentage: { type: Number, default: 0 },
  certificateIssued: { type: Boolean, default: false },
  certificateUrl: { type: String },
  enrolledAt: { type: String, default: () => new Date().toISOString() },
  completedAt: { type: String },
  status: { 
    type: String, 
    enum: ['PENDING', 'APPROVED', 'ACTIVE', 'COMPLETED', 'DROPPED', 'REMOVED', 'enrolled', 'completed', 'dropped'], 
    default: 'PENDING' 
  },
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

export const EnrollmentModel = mongoose.models.Enrollment || mongoose.model<IEnrollmentDocument>('Enrollment', EnrollmentSchema);
export default EnrollmentModel;
