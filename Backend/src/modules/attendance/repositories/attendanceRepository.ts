import AttendanceModel from '../models/Attendance';
import { Attendance } from '../../../types';
import { isMongoConnected } from '../../../configs/db';

const AttendanceM = AttendanceModel as any;

export class AttendanceRepository {
  async findById(id: string): Promise<Attendance | null> {
    if (isMongoConnected) {
      const doc = await AttendanceM.findById(id)
        .populate('studentId', 'name email role avatar firstName lastName')
        .populate('sessionId', 'title sessionDate duration status')
        .populate('enrollmentId', 'progressPercentage status enrolledAt')
        .populate('markedBy', 'name email role avatar');
      return doc ? (doc.toJSON() as Attendance) : null;
    }
    return null;
  }

  async findBySessionAndStudent(sessionId: string, studentId: string): Promise<Attendance | null> {
    if (isMongoConnected) {
      const doc = await AttendanceM.findOne({ sessionId, studentId })
        .populate('studentId', 'name email role avatar firstName lastName')
        .populate('sessionId', 'title sessionDate duration status')
        .populate('enrollmentId', 'progressPercentage status enrolledAt')
        .populate('markedBy', 'name email role avatar');
      return doc ? (doc.toJSON() as Attendance) : null;
    }
    return null;
  }

  async findBySessionId(sessionId: string): Promise<Attendance[]> {
    if (isMongoConnected) {
      const docs = await AttendanceM.find({ sessionId })
        .populate('studentId', 'name email role avatar firstName lastName')
        .populate('sessionId', 'title sessionDate duration status')
        .populate('enrollmentId', 'progressPercentage status enrolledAt')
        .populate('markedBy', 'name email role avatar');
      return docs.map((d: any) => d.toJSON() as Attendance);
    }
    return [];
  }

  async findByStudentId(studentId: string): Promise<Attendance[]> {
    if (isMongoConnected) {
      const docs = await AttendanceM.find({ studentId })
        .populate('studentId', 'name email role avatar firstName lastName')
        .populate('sessionId', 'title sessionDate duration status')
        .populate('enrollmentId', 'progressPercentage status enrolledAt')
        .populate('markedBy', 'name email role avatar');
      return docs.map((d: any) => d.toJSON() as Attendance);
    }
    return [];
  }

  async createOrUpdate(data: Omit<Attendance, 'id' | 'createdAt' | 'updatedAt'>): Promise<Attendance> {
    if (isMongoConnected) {
      const doc = await AttendanceM.findOneAndUpdate(
        { sessionId: data.sessionId, studentId: data.studentId },
        { 
          $set: { ...data, updatedAt: new Date().toISOString() },
          $setOnInsert: { createdAt: new Date().toISOString() }
        },
        { new: true, upsert: true }
      )
        .populate('studentId', 'name email role avatar firstName lastName')
        .populate('sessionId', 'title sessionDate duration status')
        .populate('enrollmentId', 'progressPercentage status enrolledAt')
        .populate('markedBy', 'name email role avatar');
      return doc.toJSON() as Attendance;
    }
    throw new Error('Database not connected');
  }

  async delete(id: string): Promise<boolean> {
    if (isMongoConnected) {
      const result = await AttendanceM.findByIdAndDelete(id);
      return !!result;
    }
    return false;
  }

  async findPaginated(filters: {
    page: number;
    limit: number;
    studentId?: string;
    sessionId?: string;
    enrollmentId?: string;
    status?: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<{ docs: Attendance[]; total: number }> {
    if (!isMongoConnected) {
      return { docs: [], total: 0 };
    }

    const { page, limit, studentId, sessionId, enrollmentId, status, sortBy, sortOrder } = filters;
    const query: Record<string, any> = {};

    if (studentId) query.studentId = studentId;
    if (sessionId) query.sessionId = sessionId;
    if (enrollmentId) query.enrollmentId = enrollmentId;
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const total = await AttendanceM.countDocuments(query);
    const docs = await AttendanceM.find(query)
      .populate('studentId', 'name email role avatar firstName lastName')
      .populate('sessionId', 'title sessionDate duration status')
      .populate('enrollmentId', 'progressPercentage status enrolledAt')
      .populate('markedBy', 'name email role avatar')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    return {
      docs: docs.map((d: any) => d.toJSON() as Attendance),
      total
    };
  }
}
