import mongoose, { Schema, Document } from 'mongoose';
import { StudentProfile } from '../../../types';

export interface IStudentProfileDocument extends Omit<StudentProfile, 'id'>, Document {}

const StudentProfileSchema = new Schema<IStudentProfileDocument>({
  userId: { type: Schema.Types.ObjectId as any, ref: 'User', required: true, index: true },
  studentCode: { type: String, required: true, unique: true },
  currentLevel: { type: String },
  github: { type: String },
  linkedin: { type: String },
  portfolio: { type: String },
  interests: [{ type: String }],
  experienceLevel: { type: String },
  totalCourses: { type: Number, default: 0 },
  completedCourses: { type: Number, default: 0 },
  attendanceAverage: { type: Number, default: 0 },
  assignmentAverage: { type: Number, default: 0 },
  participationScore: { type: Number, default: 0 },
  healthScore: { type: Number, default: 0 },
  currentActiveEnrollmentId: { type: Schema.Types.ObjectId as any, ref: 'Enrollment' },
  graduationStatus: { type: String },
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

export const StudentProfileModel = mongoose.models.StudentProfile || mongoose.model<IStudentProfileDocument>('StudentProfile', StudentProfileSchema);
export default StudentProfileModel;
