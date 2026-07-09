import mongoose, { Schema, Document } from 'mongoose';
import { User as UserType } from '../../../types';

export interface IUserDocument extends Omit<UserType, 'id'>, Document {}

const UserSchema = new Schema<IUserDocument>({
  name: { type: String, required: true },
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  username: { type: String },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: String },
  passwordHash: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['SUPER_ADMIN', 'ADMIN', 'INSTRUCTOR', 'MENTOR', 'STUDENT', 'student', 'instructor', 'admin'], 
    default: 'student' 
  },
  isEmailVerified: { type: Boolean, default: false },
  emailVerifiedAt: { type: String },
  profileImage: { type: String },
  avatar: { type: String },
  bio: { type: String },
  isActive: { type: Boolean, default: true },
  isBlocked: { type: Boolean, default: false },
  blockReason: { type: String },
  lastLogin: { type: String },
  refreshTokenVersion: { type: Number, default: 1 },
  passwordChangedAt: { type: String },
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

export const UserModel = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
export default UserModel;
