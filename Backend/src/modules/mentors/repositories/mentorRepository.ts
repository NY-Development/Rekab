import MentorProfileModel from '../models/MentorProfile';
import { MentorProfile } from '../../../types';
import { isMongoConnected } from '../../../configs/db';

const MentorProfileM = MentorProfileModel as any;

export class MentorRepository {
  async findByUserId(userId: string): Promise<MentorProfile | null> {
    if (isMongoConnected) {
      const doc = await MentorProfileM.findOne({ userId })
        .populate('userId', 'name email role avatar firstName lastName username')
        .populate('assignedTeams', 'name teamCode score')
        .populate('assignedStudents', 'name email role avatar');
      return doc ? (doc.toJSON() as MentorProfile) : null;
    }
    return null;
  }

  async findById(id: string): Promise<MentorProfile | null> {
    if (isMongoConnected) {
      const doc = await MentorProfileM.findById(id)
        .populate('userId', 'name email role avatar firstName lastName username')
        .populate('assignedTeams', 'name teamCode score')
        .populate('assignedStudents', 'name email role avatar');
      return doc ? (doc.toJSON() as MentorProfile) : null;
    }
    return null;
  }

  async create(data: Omit<MentorProfile, 'id' | 'assignedTeams' | 'assignedStudents' | 'createdAt' | 'updatedAt'>): Promise<MentorProfile> {
    if (isMongoConnected) {
      const doc = await MentorProfileM.create({
        ...data,
        assignedTeams: [],
        assignedStudents: [],
      });
      return doc.toJSON() as MentorProfile;
    }
    throw new Error('Database not connected');
  }

  async update(id: string, updateData: Partial<MentorProfile>): Promise<MentorProfile | null> {
    if (isMongoConnected) {
      const doc = await MentorProfileM.findByIdAndUpdate(
        id,
        { $set: { ...updateData, updatedAt: new Date().toISOString() } },
        { new: true }
      )
        .populate('userId', 'name email role avatar firstName lastName username')
        .populate('assignedTeams', 'name teamCode score')
        .populate('assignedStudents', 'name email role avatar');
      return doc ? (doc.toJSON() as MentorProfile) : null;
    }
    return null;
  }

  async delete(id: string): Promise<boolean> {
    if (isMongoConnected) {
      const result = await MentorProfileM.findByIdAndDelete(id);
      return !!result;
    }
    return false;
  }

  async findPaginated(filters: {
    page: number;
    limit: number;
    search?: string;
    specialization?: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<{ docs: MentorProfile[]; total: number }> {
    if (!isMongoConnected) {
      return { docs: [], total: 0 };
    }

    const { page, limit, search, specialization, sortBy, sortOrder } = filters;
    const query: Record<string, any> = {};

    if (specialization) {
      query.specialization = specialization;
    }

    const skip = (page - 1) * limit;

    if (search) {
      const UserM = MentorProfileM.db.model('User');
      const users = await UserM.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { username: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');

      const userIds = users.map((u: any) => u._id);
      query.userId = { $in: userIds };
    }

    const total = await MentorProfileM.countDocuments(query);
    const docs = await MentorProfileM.find(query)
      .populate('userId', 'name email role avatar firstName lastName username')
      .populate('assignedTeams', 'name teamCode score')
      .populate('assignedStudents', 'name email role avatar')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    return {
      docs: docs.map((d: any) => d.toJSON() as MentorProfile),
      total
    };
  }
}
