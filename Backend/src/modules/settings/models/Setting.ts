import mongoose, { Schema, Document } from 'mongoose';

export interface ISettingDocument extends Document {
  key: string;
  value: any;
  category: string;
  description?: string;
  isPublic: boolean;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: string;
  updatedAt: string;
}

const SettingSchema = new Schema<ISettingDocument>({
  key: { type: String, required: true, unique: true, index: true },
  value: { type: Schema.Types.Mixed, required: true },
  category: { type: String, required: true, index: true },
  description: { type: String },
  isPublic: { type: Boolean, default: false },
  updatedBy: { type: Schema.Types.ObjectId as any, ref: 'User' },
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

export const SettingModel = mongoose.models.Setting || mongoose.model<ISettingDocument>('Setting', SettingSchema);
export default SettingModel;
