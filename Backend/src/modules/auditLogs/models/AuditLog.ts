import mongoose, { Schema, Document } from 'mongoose';
import { AuditLog } from '../../../types';

export interface IAuditLogDocument extends Omit<AuditLog, 'id'>, Document {}

const AuditLogSchema = new Schema<IAuditLogDocument>({
  userId: { type: Schema.Types.ObjectId as any, ref: 'User', required: true, index: true },
  action: { type: String, required: true },
  entityType: { type: String, required: true },
  entityId: { type: String, required: true },
  changes: { type: Schema.Types.Mixed },
  ipAddress: { type: String },
  createdAt: { type: String, default: () => new Date().toISOString() }
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

export const AuditLogModel = mongoose.models.AuditLog || mongoose.model<IAuditLogDocument>('AuditLog', AuditLogSchema);
export default AuditLogModel;
