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
    enum: ['PENDING', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'ACTIVE', 'SUSPENDED', 'COMPLETED', 'DROPPED', 'REMOVED', 'enrolled', 'completed', 'dropped'],
    default: 'PENDING'
  },

  // Registration intake fields
  personalInfo: {
    fullName: { type: String },
    gender: { type: String },
    dateOfBirth: { type: String },
    phone: { type: String },
    age: { type: Number },
  },
  education: {
    schoolName: { type: String },
    grade: { type: String },
  },
  location: {
    city: { type: String },
    region: { type: String },
  },
  technicalReadiness: {
    operatingSystem: { type: String },
    hasPersonalComputer: { type: Boolean },
    hasDiscord: { type: Boolean },
    programmingExperience: { type: String },
    reasonForJoining: { type: String },
  },
  interests: [{ type: String }],
  // Proof of registration on the external NYDev Form (fast-track intake).
  externalForm: {
    registrationId: { type: String },
    qrCodeImage: { type: String },
  },
  agreements: {
    agreedToPayFee: { type: Boolean, default: false },
    agreedToPrivacyPolicy: { type: Boolean, default: false },
    agreedToTerms: { type: Boolean, default: false },
    understandsAttendance: { type: Boolean, default: false },
    understandsAssignments: { type: Boolean, default: false },
    agreesToRespect: { type: Boolean, default: false },
    understandsInternshipPerformanceBased: { type: Boolean, default: false },
    understandsEmploymentNotGuaranteed: { type: Boolean, default: false },
  },

  // Review tracking
  reviewerId: { type: Schema.Types.ObjectId as any, ref: 'User' },
  reviewNotes: { type: String },
  approvedAt: { type: String },
  rejectedAt: { type: String },
  rejectionReason: { type: String },

  amountPaid: { type: Number, default: 0 },
  remainingDue: { type: Number, default: 0 },

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
