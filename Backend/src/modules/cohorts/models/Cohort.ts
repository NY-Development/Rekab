import mongoose, { Schema, Document } from 'mongoose';
import { Cohort as CohortType } from '../../../types';

export interface ICohortDocument extends Omit<CohortType, 'id'>, Document {}

const CohortSchema = new Schema<ICohortDocument>({
  courseId: { type: Schema.Types.ObjectId as any, ref: 'Course', required: true, index: true },
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true, index: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  enrollmentStart: { type: String },
  enrollmentEnd: { type: String },
  capacity: { type: Number },
  maxCapacity: { type: Number, required: true }, // compatible
  enrolledStudents: [{ type: Schema.Types.ObjectId as any, ref: 'User' }],
  students: [{ type: String }], // compatible
  instructorIds: [{ type: Schema.Types.ObjectId as any, ref: 'User' }],
  instructors: [{ type: String }], // compatible
  mentorIds: [{ type: Schema.Types.ObjectId as any, ref: 'User' }],
  discordInvite: { type: String },
  googleMeetInfo: { type: String },
  schedule: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['UPCOMING', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'upcoming', 'active', 'completed'], 
    default: 'upcoming' 
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

export const CohortModel = mongoose.models.Cohort || mongoose.model<ICohortDocument>('Cohort', CohortSchema);
export default CohortModel;
