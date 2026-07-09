import mongoose, { Schema, Document } from 'mongoose';
import { MentorProfile } from '../../../types';

export interface IMentorProfileDocument extends Omit<MentorProfile, 'id'>, Document {}

const MentorProfileSchema = new Schema<IMentorProfileDocument>({
  userId: { type: Schema.Types.ObjectId as any, ref: 'User', required: true, index: true },
  specialization: { type: String },
  assignedTeams: [{ type: Schema.Types.ObjectId as any, ref: 'Team' }],
  assignedStudents: [{ type: Schema.Types.ObjectId as any, ref: 'User' }],
  availability: { type: String },
  bio: { type: String },
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

export const MentorProfileModel = mongoose.models.MentorProfile || mongoose.model<IMentorProfileDocument>('MentorProfile', MentorProfileSchema);
export default MentorProfileModel;
