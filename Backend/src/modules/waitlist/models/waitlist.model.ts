import { Schema, model, Document } from 'mongoose';

export interface IWaitlist extends Document {
  email: string;
  createdAt: Date;
}

const waitlistSchema = new Schema({
  email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
  createdAt: { type: Date, default: Date.now }
});

export const Waitlist = model<IWaitlist>('Waitlist', waitlistSchema);