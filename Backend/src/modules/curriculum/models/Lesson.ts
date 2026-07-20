import mongoose, { Schema, Document } from 'mongoose';
import { Lesson } from '../../../types';

export interface ILessonDocument extends Omit<Lesson, 'id'>, Document {}

const LessonSchema = new Schema<ILessonDocument>({
  moduleId: { type: Schema.Types.ObjectId as any, ref: 'Module', required: true, index: true },
  title: { type: String, required: true },
  description: { type: String },
  lessonType: { 
    type: String, 
    enum: ['VIDEO', 'TEXT', 'LIVE', 'PRACTICE', 'QUIZ'], 
    default: 'TEXT' 
  },
  content: { type: String, required: true },
  duration: { type: Number, default: 30 }, // in minutes
  durationMinutes: { type: Number, default: 30 }, // compatible
  resources: [{
    title: { type: String, required: true },
    url: { type: String, required: true }
  }],
  order: { type: Number, default: 1 },
  learningObjectives: [{ type: String }],
  videoUrl: { type: String },
  notesMarkdown: { type: String },
  practiceActivities: [{
    title: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false }
  }],
  externalLinks: [{
    title: { type: String, required: true },
    url: { type: String, required: true }
  }],
  estimatedMinutes: { type: Number },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  isPublished: { type: Boolean, default: true },
  isMandatory: { type: Boolean, default: true },
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

export const LessonModel = mongoose.models.Lesson || mongoose.model<ILessonDocument>('Lesson', LessonSchema);
export default LessonModel;
