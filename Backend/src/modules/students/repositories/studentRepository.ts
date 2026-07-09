import StudentProfileModel from '../models/StudentProfile';
import { StudentProfile } from '../../../types';
import { isMongoConnected } from '../../../configs/db';

const StudentProfileM = StudentProfileModel as any;

export class StudentRepository {
  async findByUserId(userId: string): Promise<StudentProfile | null> {
    if (isMongoConnected) {
      const doc = await StudentProfileM.findOne({ userId }).populate('userId', 'name email role avatar firstName lastName username');
      return doc ? (doc.toJSON() as StudentProfile) : null;
    }
    return null;
  }

  async findById(id: string): Promise<StudentProfile | null> {
    if (isMongoConnected) {
      const doc = await StudentProfileM.findById(id).populate('userId', 'name email role avatar firstName lastName username');
      return doc ? (doc.toJSON() as StudentProfile) : null;
    }
    return null;
  }

  async findByStudentCode(studentCode: string): Promise<StudentProfile | null> {
    if (isMongoConnected) {
      const doc = await StudentProfileM.findOne({ studentCode }).populate('userId', 'name email role avatar firstName lastName username');
      return doc ? (doc.toJSON() as StudentProfile) : null;
    }
    return null;
  }

  async create(data: Omit<StudentProfile, 'id' | 'totalCourses' | 'completedCourses' | 'attendanceAverage' | 'assignmentAverage' | 'participationScore' | 'healthScore' | 'createdAt' | 'updatedAt'>): Promise<StudentProfile> {
    if (isMongoConnected) {
      const doc = await StudentProfileM.create({
        ...data,
        totalCourses: 0,
        completedCourses: 0,
        attendanceAverage: 0,
        assignmentAverage: 0,
        participationScore: 0,
        healthScore: 0,
      });
      return doc.toJSON() as StudentProfile;
    }
    throw new Error('Database not connected');
  }

  async update(id: string, updateData: Partial<StudentProfile>): Promise<StudentProfile | null> {
    if (isMongoConnected) {
      const doc = await StudentProfileM.findByIdAndUpdate(
        id,
        { $set: { ...updateData, updatedAt: new Date().toISOString() } },
        { new: true }
      ).populate('userId', 'name email role avatar firstName lastName username');
      return doc ? (doc.toJSON() as StudentProfile) : null;
    }
    return null;
  }

  async findPaginated(filters: {
    page: number;
    limit: number;
    search?: string;
    currentLevel?: string;
    graduationStatus?: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<{ docs: StudentProfile[]; total: number }> {
    if (!isMongoConnected) {
      return { docs: [], total: 0 };
    }

    const { page, limit, search, currentLevel, graduationStatus, sortBy, sortOrder } = filters;
    const query: Record<string, any> = {};

    if (currentLevel) {
      query.currentLevel = currentLevel;
    }

    if (graduationStatus) {
      query.graduationStatus = graduationStatus;
    }

    const skip = (page - 1) * limit;

    // Search by studentCode or name (via User schema ref populate)
    // For searches by User name, we can do a populate matching if search is provided.
    // Or we could find user IDs first matching name/email, then filter student.
    if (search) {
      // Find matching user IDs
      const UserM = StudentProfileM.db.model('User');
      const users = await UserM.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { username: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');

      const userIds = users.map((u: any) => u._id);
      
      query.$or = [
        { studentCode: { $regex: search, $options: 'i' } },
        { userId: { $in: userIds } }
      ];
    }

    const total = await StudentProfileM.countDocuments(query);
    const docs = await StudentProfileM.find(query)
      .populate('userId', 'name email role avatar firstName lastName username')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    return {
      docs: docs.map((d: any) => d.toJSON() as StudentProfile),
      total
    };
  }
}
