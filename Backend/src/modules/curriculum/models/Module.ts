import mongoose, { Schema, Document } from 'mongoose';
import { Module } from '../../../types';

export interface IModuleDocument extends Omit<Module, 'id'>, Document {}

const ModuleSchema = new Schema<IModuleDocument>({
  courseId: { type: Schema.Types.ObjectId as any, ref: 'Course', required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  order: { type: Number, required: true },
  curriculumId: { type: Schema.Types.ObjectId as any, ref: 'Curriculum' },
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

export const ModuleModel = mongoose.models.Module || mongoose.model<IModuleDocument>('Module', ModuleSchema);
export default ModuleModel;
