import ActivityLogModel from '../models/ActivityLog';
import StudentActivityModel from '../models/StudentActivity';
import { ActivityLog, StudentActivity } from '../../../types';
import { isMongoConnected } from '../../../configs/db';

const ActivityLogM = ActivityLogModel as any;
const StudentActivityM = StudentActivityModel as any;

export class AnalyticsRepository {
  // Activity Logistics
  async createActivityLog(data: Omit<ActivityLog, 'id' | 'timestamp'>): Promise<ActivityLog> {
    if (isMongoConnected) {
      const doc = await ActivityLogM.create(data);
      return doc.toJSON() as ActivityLog;
    }
    throw new Error('Database not connected');
  }

  async findActivityLogs(filters: {
    page: number;
    limit: number;
    userId?: string;
    action?: string;
    search?: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<{ docs: ActivityLog[]; total: number }> {
    if (!isMongoConnected) {
      return { docs: [], total: 0 };
    }

    const { page, limit, userId, action, search, sortBy, sortOrder } = filters;
    const query: Record<string, any> = {};

    if (userId) query.userId = userId;
    if (action) query.action = action;
    if (search) {
      query.$or = [
        { userName: { $regex: search, $options: 'i' } },
        { details: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const total = await ActivityLogM.countDocuments(query);
    const docs = await ActivityLogM.find(query)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    return {
      docs: docs.map((d: any) => d.toJSON() as ActivityLog),
      total
    };
  }

  // Student Activity logs
  async createStudentActivity(data: Omit<StudentActivity, 'id' | 'timestamp'>): Promise<StudentActivity> {
    if (isMongoConnected) {
      const doc = await StudentActivityM.create(data);
      return doc.toJSON() as StudentActivity;
    }
    throw new Error('Database not connected');
  }

  async findStudentActivities(filters: {
    page: number;
    limit: number;
    studentId?: string;
    action?: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<{ docs: StudentActivity[]; total: number }> {
    if (!isMongoConnected) {
      return { docs: [], total: 0 };
    }

    const { page, limit, studentId, action, sortBy, sortOrder } = filters;
    const query: Record<string, any> = {};

    if (studentId) query.studentId = studentId;
    if (action) query.action = action;

    const skip = (page - 1) * limit;

    const total = await StudentActivityM.countDocuments(query);
    const docs = await StudentActivityM.find(query)
      .populate('studentId', 'name email role avatar')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    return {
      docs: docs.map((d: any) => d.toJSON() as StudentActivity),
      total
    };
  }
}
