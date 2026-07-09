import mongoose, { Schema, Document } from 'mongoose';
import { Team } from '../../../types';

export interface ITeamDocument extends Omit<Team, 'id'>, Document {}

const TeamSchema = new Schema<ITeamDocument>({
  cohortId: { type: Schema.Types.ObjectId as any, ref: 'Cohort', required: true, index: true },
  name: { type: String, required: true },
  teamCode: { type: String, required: true, unique: true },
  mentorId: { type: Schema.Types.ObjectId as any, ref: 'User' },
  leaderId: { type: Schema.Types.ObjectId as any, ref: 'User' },
  maxMembers: { type: Number, default: 5 },
  memberIds: [{ type: Schema.Types.ObjectId as any, ref: 'User' }],
  score: { type: Number, default: 0 },
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

export const TeamModel = mongoose.models.Team || mongoose.model<ITeamDocument>('Team', TeamSchema);
export default TeamModel;
