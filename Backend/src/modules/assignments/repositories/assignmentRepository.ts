import AssignmentModel from '../models/Assignment';
import { Assignment } from '../../../types';
import { isMongoConnected } from '../../../configs/db';

const AssignmentM = AssignmentModel as any;

export class AssignmentRepository {
  async findById(id: string): Promise<Assignment | null> {
    if (isMongoConnected) {
      const doc = await AssignmentM.findById(id)
        .populate('courseId', 'title category slug thumbnail price code')
        .populate('cohortId', 'name code startDate endDate status')
        .populate('createdBy', 'name email role avatar');
      return doc ? (doc.toJSON() as Assignment) : null;
    }
    return null;
  }

  async findByCohortId(cohortId: string): Promise<Assignment[]> {
    if (isMongoConnected) {
      const docs = await AssignmentM.find({ cohortId })
        .populate('courseId', 'title category slug thumbnail price code')
        .populate('cohortId', 'name code startDate endDate status')
        .populate('createdBy', 'name email role avatar')
        .sort({ dueDate: 1 });
      return docs.map((d: any) => d.toJSON() as Assignment);
    }
    return [];
  }

  async create(data: Omit<Assignment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Assignment> {
    if (isMongoConnected) {
      const doc = await AssignmentM.create(data);
      return doc.toJSON() as Assignment;
    }
    throw new Error('Database not connected');
  }

  async update(id: string, updateData: Partial<Assignment>): Promise<Assignment | null> {
    if (isMongoConnected) {
      const doc = await AssignmentM.findByIdAndUpdate(
        id,
        { $set: { ...updateData, updatedAt: new Date().toISOString() } },
        { new: true }
      )
        .populate('courseId', 'title category slug thumbnail price code')
        .populate('cohortId', 'name code startDate endDate status')
        .populate('createdBy', 'name email role avatar');
      return doc ? (doc.toJSON() as Assignment) : null;
    }
    return null;
  }

  async delete(id: string): Promise<boolean> {
    if (isMongoConnected) {
      const result = await AssignmentM.findByIdAndDelete(id);
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
    moduleId?: string;
    assignmentType?: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<{ docs: Assignment[]; total: number }> {
    if (!isMongoConnected) {
      return { docs: [], total: 0 };
    }

    const { page, limit, cohortId, cohortIds, courseId, moduleId, assignmentType, sortBy, sortOrder } = filters;
    const query: Record<string, any> = {};

    if (cohortId) query.cohortId = cohortId;
    if (cohortIds && cohortIds.length > 0) query.cohortId = { $in: cohortIds };
    if (courseId) query.courseId = courseId;
    if (moduleId) query.moduleId = moduleId;
    if (assignmentType) query.assignmentType = assignmentType;

    const skip = (page - 1) * limit;

    const total = await AssignmentM.countDocuments(query);
    const docs = await AssignmentM.find(query)
      .populate('courseId', 'title category slug thumbnail price code')
      .populate('cohortId', 'name code startDate endDate status')
      .populate('createdBy', 'name email role avatar')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    return {
      docs: docs.map((d: any) => d.toJSON() as Assignment),
      total
    };
  }
}
