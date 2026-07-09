import mongoose, { Schema, Document } from 'mongoose';
import { Curriculum } from '../../../types';

export interface ICurriculumDocument extends Omit<Curriculum, 'id'>, Document {}

const CurriculumSchema = new Schema<ICurriculumDocument>({
  courseId: { type: Schema.Types.ObjectId as any, ref: 'Course', required: true, index: true },
  title: { type: String, required: true },
  description: { type: String },
  order: { type: Number, required: true },
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

export const CurriculumModel = mongoose.models.Curriculum || mongoose.model<ICurriculumDocument>('Curriculum', CurriculumSchema);
export default CurriculumModel;
