import mongoose, { Schema, Document } from 'mongoose';
import { StudentActivity } from '../../../types';

export interface IStudentActivityDocument extends Omit<StudentActivity, 'id'>, Document {}

const StudentActivitySchema = new Schema<IStudentActivityDocument>({
  studentId: { type: Schema.Types.ObjectId as any, ref: 'User', required: true, index: true },
  action: { 
    type: String, 
    enum: ['LOGIN', 'LOGOUT', 'JOIN_SESSION', 'SUBMIT_ASSIGNMENT', 'DOWNLOAD_RESOURCE', 'OPEN_COURSE', 'VIEW_ANNOUNCEMENT'], 
    required: true 
  },
  metadata: { type: Schema.Types.Mixed },
  timestamp: { type: String, default: () => new Date().toISOString() }
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

export const StudentActivityModel = mongoose.models.StudentActivity || mongoose.model<IStudentActivityDocument>('StudentActivity', StudentActivitySchema);
export default StudentActivityModel;
