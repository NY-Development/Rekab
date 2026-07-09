import TeamModel from '../models/Team';
import { Team } from '../../../types';
import { isMongoConnected } from '../../../configs/db';

const TeamM = TeamModel as any;

export class TeamRepository {
  async findById(id: string): Promise<Team | null> {
    if (isMongoConnected) {
      const doc = await TeamM.findById(id)
        .populate('cohortId', 'name code')
        .populate('mentorId', 'name email role avatar')
        .populate('leaderId', 'name email role avatar')
        .populate('memberIds', 'name email role avatar');
      return doc ? (doc.toJSON() as Team) : null;
    }
    return null;
  }

  async findByCohortId(cohortId: string): Promise<Team[]> {
    if (isMongoConnected) {
      const docs = await TeamM.find({ cohortId })
        .populate('cohortId', 'name code')
        .populate('mentorId', 'name email role avatar')
        .populate('leaderId', 'name email role avatar')
        .populate('memberIds', 'name email role avatar');
      return docs.map((d: any) => d.toJSON() as Team);
    }
    return [];
  }

  async findByTeamCode(teamCode: string): Promise<Team | null> {
    if (isMongoConnected) {
      const doc = await TeamM.findOne({ teamCode })
        .populate('cohortId', 'name code')
        .populate('mentorId', 'name email role avatar')
        .populate('leaderId', 'name email role avatar')
        .populate('memberIds', 'name email role avatar');
      return doc ? (doc.toJSON() as Team) : null;
    }
    return null;
  }

  async findByMemberUserId(userId: string): Promise<Team[]> {
    if (isMongoConnected) {
      const docs = await TeamM.find({ memberIds: userId })
        .populate('cohortId', 'name code')
        .populate('mentorId', 'name email role avatar')
        .populate('leaderId', 'name email role avatar')
        .populate('memberIds', 'name email role avatar');
      return docs.map((d: any) => d.toJSON() as Team);
    }
    return [];
  }

  async create(data: Omit<Team, 'id' | 'score' | 'createdAt' | 'updatedAt'>): Promise<Team> {
    if (isMongoConnected) {
      const doc = await TeamM.create({
        ...data,
        score: 0,
      });
      return doc.toJSON() as Team;
    }
    throw new Error('Database not connected');
  }

  async update(id: string, updateData: Partial<Team>): Promise<Team | null> {
    if (isMongoConnected) {
      const doc = await TeamM.findByIdAndUpdate(
        id,
        { $set: { ...updateData, updatedAt: new Date().toISOString() } },
        { new: true }
      )
        .populate('cohortId', 'name code')
        .populate('mentorId', 'name email role avatar')
        .populate('leaderId', 'name email role avatar')
        .populate('memberIds', 'name email role avatar');
      return doc ? (doc.toJSON() as Team) : null;
    }
    return null;
  }

  async delete(id: string): Promise<boolean> {
    if (isMongoConnected) {
      const result = await TeamM.findByIdAndDelete(id);
      return !!result;
    }
    return false;
  }

  async findPaginated(filters: {
    page: number;
    limit: number;
    search?: string;
    cohortId?: string;
    mentorId?: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<{ docs: Team[]; total: number }> {
    if (!isMongoConnected) {
      return { docs: [], total: 0 };
    }

    const { page, limit, search, cohortId, mentorId, sortBy, sortOrder } = filters;
    const query: Record<string, any> = {};

    if (cohortId) query.cohortId = cohortId;
    if (mentorId) query.mentorId = mentorId;

    const skip = (page - 1) * limit;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { teamCode: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await TeamM.countDocuments(query);
    const docs = await TeamM.find(query)
      .populate('cohortId', 'name code')
      .populate('mentorId', 'name email role avatar')
      .populate('leaderId', 'name email role avatar')
      .populate('memberIds', 'name email role avatar')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    return {
      docs: docs.map((d: any) => d.toJSON() as Team),
      total
    };
  }
}
