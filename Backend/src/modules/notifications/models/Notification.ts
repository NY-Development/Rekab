import mongoose, { Schema, Document } from 'mongoose';
import { Notification } from '../../../types';

export interface INotificationDocument extends Omit<Notification, 'id'>, Document {}

const NotificationSchema = new Schema<INotificationDocument>({
  userId: { type: Schema.Types.ObjectId as any, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String },
  actionUrl: { type: String },
  isRead: { type: Boolean, default: false },
  sentAt: { type: String, default: () => new Date().toISOString() }
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

export const NotificationModel = mongoose.models.Notification || mongoose.model<INotificationDocument>('Notification', NotificationSchema);
export default NotificationModel;
