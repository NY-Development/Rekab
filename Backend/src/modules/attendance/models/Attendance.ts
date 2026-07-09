import mongoose, { Schema, Document } from 'mongoose';
import { Attendance } from '../../../types';

export interface IAttendanceDocument extends Omit<Attendance, 'id'>, Document {}

const AttendanceSchema = new Schema<IAttendanceDocument>({
  studentId: { type: Schema.Types.ObjectId as any, ref: 'User', required: true, index: true },
  sessionId: { type: Schema.Types.ObjectId as any, ref: 'Session', required: true, index: true },
  enrollmentId: { type: Schema.Types.ObjectId as any, ref: 'Enrollment', required: true, index: true },
  status: { type: String, enum: ['PRESENT', 'LATE', 'ABSENT'], default: 'PRESENT' },
  checkInTime: { type: String },
  remarks: { type: String },
  markedBy: { type: Schema.Types.ObjectId as any, ref: 'User' },
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

export const AttendanceModel = mongoose.models.Attendance || mongoose.model<IAttendanceDocument>('Attendance', AttendanceSchema);
export default AttendanceModel;
