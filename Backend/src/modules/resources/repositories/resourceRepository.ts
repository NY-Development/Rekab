import ResourceModel from '../models/Resource';
import { Resource } from '../../../types';
import { isMongoConnected } from '../../../configs/db';

const ResourceM = ResourceModel as any;

export class ResourceRepository {
  async findById(id: string): Promise<Resource | null> {
    if (isMongoConnected) {
      const doc = await ResourceM.findById(id)
        .populate('courseId', 'title category slug thumbnail price code')
        .populate('uploadedBy', 'name email role avatar');
      return doc ? (doc.toJSON() as Resource) : null;
    }
    return null;
  }

  async findByCourseId(courseId: string): Promise<Resource[]> {
    if (isMongoConnected) {
      const docs = await ResourceM.find({ courseId })
        .populate('courseId', 'title category slug thumbnail price code')
        .populate('uploadedBy', 'name email role avatar')
        .sort({ title: 1 });
      return docs.map((d: any) => d.toJSON() as Resource);
    }
    return [];
  }

  async create(data: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>): Promise<Resource> {
    if (isMongoConnected) {
      const doc = await ResourceM.create(data);
      return doc.toJSON() as Resource;
    }
    throw new Error('Database not connected');
  }

  async update(id: string, updateData: Partial<Resource>): Promise<Resource | null> {
    if (isMongoConnected) {
      const doc = await ResourceM.findByIdAndUpdate(
        id,
        { $set: { ...updateData, updatedAt: new Date().toISOString() } },
        { new: true }
      )
        .populate('courseId', 'title category slug thumbnail price code')
        .populate('uploadedBy', 'name email role avatar');
      return doc ? (doc.toJSON() as Resource) : null;
    }
    return null;
  }

  async delete(id: string): Promise<boolean> {
    if (isMongoConnected) {
      const result = await ResourceM.findByIdAndDelete(id);
      return !!result;
    }
    return false;
  }

  async findPaginated(filters: {
    page: number;
    limit: number;
    courseId?: string;
    resourceType?: string;
    search?: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<{ docs: Resource[]; total: number }> {
    if (!isMongoConnected) {
      return { docs: [], total: 0 };
    }

    const { page, limit, courseId, resourceType, search, sortBy, sortOrder } = filters;
    const query: Record<string, any> = {};

    if (courseId) query.courseId = courseId;
    if (resourceType) query.resourceType = resourceType;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const total = await ResourceM.countDocuments(query);
    const docs = await ResourceM.find(query)
      .populate('courseId', 'title category slug thumbnail price code')
      .populate('uploadedBy', 'name email role avatar')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    return {
      docs: docs.map((d: any) => d.toJSON() as Resource),
      total
    };
  }
}
