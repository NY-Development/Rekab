import mongoose, { Schema, Document } from 'mongoose';
import { Course as CourseType } from '../../../types';

export interface ICourseDocument extends Omit<CourseType, 'id'>, Document {}

const CourseSchema = new Schema<ICourseDocument>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  shortDescription: { type: String },
  description: { type: String, required: true },
  thumbnail: { type: String },
  coverImage: { type: String },
  category: { type: String, enum: ['Frontend', 'Backend', 'DevOps', 'Full-Stack'], required: true },
  level: { type: String, default: 'Intermediate' },
  language: { type: String, default: 'English' },
  durationWeeks: { type: Number, required: true },
  estimatedHours: { type: Number },
  price: { type: Number, default: 0 },
  discountPrice: { type: Number, default: 0 },
  currency: { type: String, default: 'ETB' },
  prerequisites: [{ type: String }],
  learningOutcomes: [{ type: String }],
  skills: [{ type: String }],
  instructors: [{ type: Schema.Types.ObjectId as any, ref: 'User' }],
  mentors: [{ type: Schema.Types.ObjectId as any, ref: 'User' }],
  enrollmentEnabled: { type: Boolean, default: true },
  maxStudentsPerCohort: { type: Number, default: 30 },
  defaultTeamSize: { type: Number, default: 5 },
  allowWaitlist: { type: Boolean, default: true },
  totalEnrollments: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  image: { type: String, required: true }, // compatible
  syllabusSummary: { type: String, required: true }, // compatible
  modules: { type: Schema.Types.Mixed as any, default: [] } as any // Left for compatibility
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret: any) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

export const CourseModel = mongoose.models.Course || mongoose.model<ICourseDocument>('Course', CourseSchema);
export default CourseModel;
