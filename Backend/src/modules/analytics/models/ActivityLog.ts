import mongoose, { Schema, Document } from 'mongoose';
import { ActivityLog as ActivityLogType } from '../../../types';

export interface IActivityLogDocument extends Omit<ActivityLogType, 'id'>, Document {}

const ActivityLogSchema = new Schema<IActivityLogDocument>({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  action: { type: String, required: true },
  details: { type: String, required: true },
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

export const ActivityLogModel = mongoose.models.ActivityLog || mongoose.model<IActivityLogDocument>('ActivityLog', ActivityLogSchema);
export default ActivityLogModel;
