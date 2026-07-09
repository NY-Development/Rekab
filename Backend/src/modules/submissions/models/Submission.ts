import mongoose, { Schema, Document } from 'mongoose';
import { Submission as SubmissionType } from '../../../types';

export interface ISubmissionDocument extends Omit<SubmissionType, 'id'>, Document {}

const SubmissionSchema = new Schema<ISubmissionDocument>({
  assignmentId: { type: Schema.Types.ObjectId as any, ref: 'Assignment', required: true, index: true },
  studentId: { type: Schema.Types.ObjectId as any, ref: 'User', required: true, index: true },
  cohortId: { type: String, required: true }, // compatible
  teamId: { type: Schema.Types.ObjectId as any, ref: 'Team' },
  githubLink: { type: String },
  liveLink: { type: String },
  repoUrl: { type: String }, // compatible
  notes: { type: String },
  attachments: [{ type: String }],
  score: { type: Number },
  points: { type: Number }, // compatible
  feedback: { type: String },
  gradedBy: { type: String }, // compatible
  submittedAt: { type: String, default: () => new Date().toISOString() },
  gradedAt: { type: String },
  status: { 
    type: String, 
    enum: ['submitted', 'graded', 'late', 'SUBMITTED', 'GRADED', 'LATE'], 
    default: 'submitted' 
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

export const SubmissionModel = mongoose.models.Submission || mongoose.model<ISubmissionDocument>('Submission', SubmissionSchema);
export default SubmissionModel;
