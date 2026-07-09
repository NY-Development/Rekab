import mongoose, { Schema, Document } from 'mongoose';
import { Resource } from '../../../types';

export interface IResourceDocument extends Omit<Resource, 'id'>, Document {}

const ResourceSchema = new Schema<IResourceDocument>({
  courseId: { type: Schema.Types.ObjectId as any, ref: 'Course', required: true, index: true },
  title: { type: String, required: true },
  description: { type: String },
  resourceType: { 
    type: String, 
    enum: ['PDF', 'VIDEO', 'LINK', 'ZIP', 'GITHUB', 'SLIDES'], 
    default: 'LINK' 
  },
  url: { type: String, required: true },
  uploadedBy: { type: Schema.Types.ObjectId as any, ref: 'User', required: true },
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

export const ResourceModel = mongoose.models.Resource || mongoose.model<IResourceDocument>('Resource', ResourceSchema);
export default ResourceModel;
