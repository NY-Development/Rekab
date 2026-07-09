import mongoose, { Schema, Document } from 'mongoose';
import { Announcement } from '../../../types';

export interface IAnnouncementDocument extends Omit<Announcement, 'id'>, Document {}

const AnnouncementSchema = new Schema<IAnnouncementDocument>({
  courseId: { type: Schema.Types.ObjectId as any, ref: 'Course', index: true },
  cohortId: { type: Schema.Types.ObjectId as any, ref: 'Cohort', index: true },
  teamId: { type: Schema.Types.ObjectId as any, ref: 'Team', index: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  priority: { type: String, enum: ['LOW', 'NORMAL', 'HIGH', 'URGENT'], default: 'NORMAL' },
  publishDate: { type: String, default: () => new Date().toISOString() },
  createdBy: { type: Schema.Types.ObjectId as any, ref: 'User', required: true },
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

export const AnnouncementModel = mongoose.models.Announcement || mongoose.model<IAnnouncementDocument>('Announcement', AnnouncementSchema);
export default AnnouncementModel;
