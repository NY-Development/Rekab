import AnnouncementModel from '../models/Announcement';
import { Announcement } from '../../../types';
import { isMongoConnected } from '../../../configs/db';

const AnnouncementM = AnnouncementModel as any;

export class AnnouncementRepository {
  async findById(id: string): Promise<Announcement | null> {
    if (isMongoConnected) {
      const doc = await AnnouncementM.findById(id)
        .populate('courseId', 'title category slug thumbnail price code')
        .populate('cohortId', 'name code startDate endDate status')
        .populate('teamId', 'name teamCode score')
        .populate('createdBy', 'name email role avatar');
      return doc ? (doc.toJSON() as Announcement) : null;
    }
    return null;
  }

  async create(data: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>): Promise<Announcement> {
    if (isMongoConnected) {
      const doc = await AnnouncementM.create(data);
      return doc.toJSON() as Announcement;
    }
    throw new Error('Database not connected');
  }

  async update(id: string, updateData: Partial<Announcement>): Promise<Announcement | null> {
    if (isMongoConnected) {
      const doc = await AnnouncementM.findByIdAndUpdate(
        id,
        { $set: { ...updateData, updatedAt: new Date().toISOString() } },
        { new: true }
      )
        .populate('courseId', 'title category slug thumbnail price code')
        .populate('cohortId', 'name code startDate endDate status')
        .populate('teamId', 'name teamCode score')
        .populate('createdBy', 'name email role avatar');
      return doc ? (doc.toJSON() as Announcement) : null;
    }
    return null;
  }

  async delete(id: string): Promise<boolean> {
    if (isMongoConnected) {
      const result = await AnnouncementM.findByIdAndDelete(id);
      return !!result;
    }
    return false;
  }

  async findPaginated(filters: {
    page: number;
    limit: number;
    courseId?: string;
    cohortId?: string;
    teamId?: string;
    priority?: string;
    search?: string;
    accessScope?: { courseIds: string[]; cohortIds: string[] };
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<{ docs: Announcement[]; total: number }> {
    if (!isMongoConnected) {
      return { docs: [], total: 0 };
    }

    const { page, limit, courseId, cohortId, teamId, priority, search, accessScope, sortBy, sortOrder } = filters;
    const query: Record<string, any> = {};

    if (courseId) query.courseId = courseId;
    if (cohortId) query.cohortId = cohortId;
    if (teamId) query.teamId = teamId;
    if (priority) query.priority = priority;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    if (accessScope) {
      query.$and = [
        {
          $or: [
            { courseId: { $exists: false } },
            { courseId: null },
            { courseId: { $in: accessScope.courseIds } },
            { cohortId: { $in: accessScope.cohortIds } },
          ],
        },
      ];
    }

    const skip = (page - 1) * limit;

    const total = await AnnouncementM.countDocuments(query);
    const docs = await AnnouncementM.find(query)
      .populate('courseId', 'title category slug thumbnail price code')
      .populate('cohortId', 'name code startDate endDate status')
      .populate('teamId', 'name teamCode score')
      .populate('createdBy', 'name email role avatar')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    return {
      docs: docs.map((d: any) => d.toJSON() as Announcement),
      total
    };
  }
}
