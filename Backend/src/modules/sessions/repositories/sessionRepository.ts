import SessionModel from '../models/Session';
import { Session } from '../../../types';
import { isMongoConnected } from '../../../configs/db';

const SessionM = SessionModel as any;

export class SessionRepository {
  async findById(id: string): Promise<Session | null> {
    if (isMongoConnected) {
      const doc = await SessionM.findById(id)
        .populate('courseId', 'title category slug thumbnail price code')
        .populate('cohortId', 'name code startDate endDate status')
        .populate('instructorId', 'name email role avatar firstName lastName');
      return doc ? (doc.toJSON() as Session) : null;
    }
    return null;
  }

  async findByCohortId(cohortId: string): Promise<Session[]> {
    if (isMongoConnected) {
      const docs = await SessionM.find({ cohortId })
        .populate('courseId', 'title category slug thumbnail price code')
        .populate('cohortId', 'name code startDate endDate status')
        .populate('instructorId', 'name email role avatar firstName lastName')
        .sort({ sessionDate: 1 });
      return docs.map((d: any) => d.toJSON() as Session);
    }
    return [];
  }

  async create(data: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>): Promise<Session> {
    if (isMongoConnected) {
      const doc = await SessionM.create(data);
      return doc.toJSON() as Session;
    }
    throw new Error('Database not connected');
  }

  async update(id: string, updateData: Partial<Session>): Promise<Session | null> {
    if (isMongoConnected) {
      const doc = await SessionM.findByIdAndUpdate(
        id,
        { $set: { ...updateData, updatedAt: new Date().toISOString() } },
        { new: true }
      )
        .populate('courseId', 'title category slug thumbnail price code')
        .populate('cohortId', 'name code startDate endDate status')
        .populate('instructorId', 'name email role avatar firstName lastName');
      return doc ? (doc.toJSON() as Session) : null;
    }
    return null;
  }

  async delete(id: string): Promise<boolean> {
    if (isMongoConnected) {
      const result = await SessionM.findByIdAndDelete(id);
      return !!result;
    }
    return false;
  }

  async findPaginated(filters: {
    page: number;
    limit: number;
    cohortId?: string;
    cohortIds?: string[];
    courseId?: string;
    instructorId?: string;
    status?: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<{ docs: Session[]; total: number }> {
    if (!isMongoConnected) {
      return { docs: [], total: 0 };
    }

    const { page, limit, cohortId, cohortIds, courseId, instructorId, status, sortBy, sortOrder } = filters;
    const query: Record<string, any> = {};

    if (cohortId) query.cohortId = cohortId;
    if (cohortIds && cohortIds.length > 0) query.cohortId = { $in: cohortIds };
    if (courseId) query.courseId = courseId;
    if (instructorId) query.instructorId = instructorId;
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const total = await SessionM.countDocuments(query);
    const docs = await SessionM.find(query)
      .populate('courseId', 'title category slug thumbnail price code')
      .populate('cohortId', 'name code startDate endDate status')
      .populate('instructorId', 'name email role avatar firstName lastName')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    return {
      docs: docs.map((d: any) => d.toJSON() as Session),
      total
    };
  }
}
