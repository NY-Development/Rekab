import mongoose, { Schema, Document } from 'mongoose';

export interface IContact {
  id: string;
  name: string;
  email: string;
  topic?: string;
  message: string;
  userId?: string; // set when submitted by a logged-in user
  status: 'NEW' | 'HANDLED';
  handledBy?: string;
  handledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IContactDocument extends Omit<IContact, 'id'>, Document {}

const ContactSchema = new Schema<IContactDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    topic: { type: String },
    message: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId as any, ref: 'User' },
    status: { type: String, enum: ['NEW', 'HANDLED'], default: 'NEW', index: true },
    handledBy: { type: Schema.Types.ObjectId as any, ref: 'User' },
    handledAt: { type: String },
    createdAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String, default: () => new Date().toISOString() },
  },
  {
    toJSON: {
      transform: (_doc, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const ContactModel = mongoose.models.Contact || mongoose.model<IContactDocument>('Contact', ContactSchema);
export default ContactModel;
