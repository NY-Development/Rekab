import mongoose, { Schema, Document } from 'mongoose';
import { CourseStaffAssignment } from '../../../types';

export interface ICourseStaffAssignmentDocument extends Omit<CourseStaffAssignment, 'id'>, Document {}

const CourseStaffAssignmentSchema = new Schema<ICourseStaffAssignmentDocument>({
  courseId: { type: Schema.Types.ObjectId as any, ref: 'Course', required: true, index: true },
  cohortId: { type: Schema.Types.ObjectId as any, ref: 'Cohort', index: true },
  userId: { type: Schema.Types.ObjectId as any, ref: 'User', required: true, index: true },
  role: { 
    type: String, 
    enum: ['LEAD_INSTRUCTOR', 'ASSISTANT_INSTRUCTOR', 'MENTOR'], 
    required: true 
  },
  assignedBy: { type: Schema.Types.ObjectId as any, ref: 'User', required: true },
  assignedAt: { type: String, default: () => new Date().toISOString() },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' }
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

export const CourseStaffAssignmentModel = mongoose.models.CourseStaffAssignment || mongoose.model<ICourseStaffAssignmentDocument>('CourseStaffAssignment', CourseStaffAssignmentSchema);
export default CourseStaffAssignmentModel;
