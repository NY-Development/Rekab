import mongoose, { Schema, Document } from 'mongoose';
import { StudentHealth } from '../../../types';

export interface IStudentHealthDocument extends Omit<StudentHealth, 'id'>, Document {}

const StudentHealthSchema = new Schema<IStudentHealthDocument>({
  studentId: { type: Schema.Types.ObjectId as any, ref: 'User', required: true, index: true },
  enrollmentId: { type: Schema.Types.ObjectId as any, ref: 'Enrollment', required: true, index: true },
  attendanceScore: { type: Number, default: 100 },
  assignmentScore: { type: Number, default: 100 },
  participationScore: { type: Number, default: 100 },
  engagementScore: { type: Number, default: 100 },
  overallScore: { type: Number, default: 100 },
  riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'LOW' },
  lastCalculatedAt: { type: String, default: () => new Date().toISOString() }
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

export const StudentHealthModel = mongoose.models.StudentHealth || mongoose.model<IStudentHealthDocument>('StudentHealth', StudentHealthSchema);
export default StudentHealthModel;
