import InstructorProfileModel from '../models/InstructorProfile';
import { InstructorProfile } from '../../../types';
import { isMongoConnected } from '../../../configs/db';

const InstructorProfileM = InstructorProfileModel as any;

export class InstructorRepository {
  async findByUserId(userId: string): Promise<InstructorProfile | null> {
    if (isMongoConnected) {
      const doc = await InstructorProfileM.findOne({ userId })
        .populate('userId', 'name email role avatar firstName lastName username')
        .populate('assignedCourses', 'title category slug thumbnail price')
        .populate('assignedCohorts', 'name code startDate endDate status');
      return doc ? (doc.toJSON() as InstructorProfile) : null;
    }
    return null;
  }

  async findById(id: string): Promise<InstructorProfile | null> {
    if (isMongoConnected) {
      const doc = await InstructorProfileM.findById(id)
        .populate('userId', 'name email role avatar firstName lastName username')
        .populate('assignedCourses', 'title category slug thumbnail price')
        .populate('assignedCohorts', 'name code startDate endDate status');
      return doc ? (doc.toJSON() as InstructorProfile) : null;
    }
    return null;
  }

  async create(data: Omit<InstructorProfile, 'id' | 'rating' | 'totalStudents' | 'createdAt' | 'updatedAt'>): Promise<InstructorProfile> {
    if (isMongoConnected) {
      const doc = await InstructorProfileM.create({
        ...data,
        rating: 5,
        totalStudents: 0,
        assignedCourses: [],
        assignedCohorts: [],
      });
      return doc.toJSON() as InstructorProfile;
    }
    throw new Error('Database not connected');
  }

  async update(id: string, updateData: Partial<InstructorProfile>): Promise<InstructorProfile | null> {
    if (isMongoConnected) {
      const doc = await InstructorProfileM.findByIdAndUpdate(
        id,
        { $set: { ...updateData, updatedAt: new Date().toISOString() } },
        { new: true }
      )
        .populate('userId', 'name email role avatar firstName lastName username')
        .populate('assignedCourses', 'title category slug thumbnail price')
        .populate('assignedCohorts', 'name code startDate endDate status');
      return doc ? (doc.toJSON() as InstructorProfile) : null;
    }
    return null;
  }

  async delete(id: string): Promise<boolean> {
    if (isMongoConnected) {
      const result = await InstructorProfileM.findByIdAndDelete(id);
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
  }): Promise<{ docs: InstructorProfile[]; total: number }> {
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
      const UserM = InstructorProfileM.db.model('User');
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

    const total = await InstructorProfileM.countDocuments(query);
    const docs = await InstructorProfileM.find(query)
      .populate('userId', 'name email role avatar firstName lastName username')
      .populate('assignedCourses', 'title category slug thumbnail price')
      .populate('assignedCohorts', 'name code startDate endDate status')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    return {
      docs: docs.map((d: any) => d.toJSON() as InstructorProfile),
      total
    };
  }
}
