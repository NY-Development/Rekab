import mongoose, { Schema, Document } from 'mongoose';
import { Assignment } from '../../../types';

export interface IAssignmentDocument extends Omit<Assignment, 'id'>, Document {}

const AssignmentSchema = new Schema<IAssignmentDocument>({
  courseId: { type: Schema.Types.ObjectId as any, ref: 'Course', required: true, index: true },
  cohortId: { type: Schema.Types.ObjectId as any, ref: 'Cohort', required: true, index: true },
  moduleId: { type: String, required: true }, // compatible
  title: { type: String, required: true },
  description: { type: String, required: true },
  assignmentType: { type: String, enum: ['INDIVIDUAL', 'TEAM'], default: 'INDIVIDUAL' },
  maxScore: { type: Number, default: 100 },
  maxPoints: { type: Number, required: true }, // compatible
  dueDate: { type: String, required: true },
  submissionType: { type: String, enum: ['github', 'text', 'file'], default: 'github' }, // compatible
  attachments: [{ type: String }],
  createdBy: { type: Schema.Types.ObjectId as any, ref: 'User' },
  rubric: { type: String },
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

export const AssignmentModel = mongoose.models.Assignment || mongoose.model<IAssignmentDocument>('Assignment', AssignmentSchema);
export default AssignmentModel;
