import mongoose, { Schema, Document } from 'mongoose';
import { InstructorProfile } from '../../../types';

export interface IInstructorProfileDocument extends Omit<InstructorProfile, 'id'>, Document {}

const InstructorProfileSchema = new Schema<IInstructorProfileDocument>({
  userId: { type: Schema.Types.ObjectId as any, ref: 'User', required: true, index: true },
  specialization: { type: String },
  yearsExperience: { type: Number },
  bio: { type: String },
  skills: [{ type: String }],
  assignedCourses: [{ type: Schema.Types.ObjectId as any, ref: 'Course' }],
  assignedCohorts: [{ type: Schema.Types.ObjectId as any, ref: 'Cohort' }],
  rating: { type: Number, default: 5 },
  totalStudents: { type: Number, default: 0 },
  certifications: [{ type: String }],
  socialLinks: {
    linkedin: { type: String },
    github: { type: String },
    portfolio: { type: String },
    website: { type: String }
  },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'], default: 'ACTIVE' },
  availability: { type: String },
  profilePicture: { type: String },
  phone: { type: String },
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

export const InstructorProfileModel = mongoose.models.InstructorProfile || mongoose.model<IInstructorProfileDocument>('InstructorProfile', InstructorProfileSchema);
export default InstructorProfileModel;
