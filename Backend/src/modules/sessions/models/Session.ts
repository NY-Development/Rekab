import mongoose, { Schema, Document } from 'mongoose';
import { Session } from '../../../types';

export interface ISessionDocument extends Omit<Session, 'id'>, Document {}

const SessionSchema = new Schema<ISessionDocument>({
  courseId: { type: Schema.Types.ObjectId as any, ref: 'Course', required: true, index: true },
  cohortId: { type: Schema.Types.ObjectId as any, ref: 'Cohort', required: true, index: true },
  instructorId: { type: Schema.Types.ObjectId as any, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  description: { type: String },
  type: {
    type: String,
    enum: ['LECTURE', 'LAB', 'WORKSHOP', 'STANDUP', 'REVIEW', 'OTHER'],
    default: 'LECTURE',
  },
  sessionDate: { type: String, required: true },
  duration: { type: Number, default: 120 }, // duration in minutes
  meetLink: { type: String },
  recordingLink: { type: String },
  status: { 
    type: String, 
    enum: ['UPCOMING', 'ACTIVE', 'COMPLETED', 'CANCELLED'], 
    default: 'UPCOMING' 
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

export const SessionModel = mongoose.models.Session || mongoose.model<ISessionDocument>('Session', SessionSchema);
export default SessionModel;
