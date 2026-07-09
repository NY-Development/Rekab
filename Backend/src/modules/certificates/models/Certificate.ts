import mongoose, { Schema, Document } from 'mongoose';

export interface ICertificateDocument extends Document {
  studentId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  cohortId: mongoose.Types.ObjectId;
  certificateNumber: string;
  issueDate: string;
  credentialUrl?: string;
  pdfUrl?: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

const CertificateSchema = new Schema<ICertificateDocument>({
  studentId: { type: Schema.Types.ObjectId as any, ref: 'User', required: true, index: true },
  courseId: { type: Schema.Types.ObjectId as any, ref: 'Course', required: true, index: true },
  cohortId: { type: Schema.Types.ObjectId as any, ref: 'Cohort', required: true, index: true },
  certificateNumber: { type: String, required: true, unique: true, index: true },
  issueDate: { type: String, default: () => new Date().toISOString() },
  credentialUrl: { type: String },
  pdfUrl: { type: String },
  metadata: { type: Schema.Types.Mixed },
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

export const CertificateModel = mongoose.models.Certificate || mongoose.model<ICertificateDocument>('Certificate', CertificateSchema);
export default CertificateModel;
