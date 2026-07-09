import StudentHealthModel from '../models/StudentHealth';
import { StudentHealth } from '../../../types';
import { isMongoConnected } from '../../../configs/db';

const StudentHealthM = StudentHealthModel as any;

export class StudentHealthRepository {
  async findById(id: string): Promise<StudentHealth | null> {
    if (isMongoConnected) {
      const doc = await StudentHealthM.findById(id)
        .populate('studentId', 'name email role avatar firstName lastName')
        .populate('enrollmentId', 'progressPercentage status enrolledAt');
      return doc ? (doc.toJSON() as StudentHealth) : null;
    }
    return null;
  }

  async findByStudentAndEnrollment(studentId: string, enrollmentId: string): Promise<StudentHealth | null> {
    if (isMongoConnected) {
      const doc = await StudentHealthM.findOne({ studentId, enrollmentId })
        .populate('studentId', 'name email role avatar firstName lastName')
        .populate('enrollmentId', 'progressPercentage status enrolledAt');
      return doc ? (doc.toJSON() as StudentHealth) : null;
    }
    return null;
  }

  async upsert(data: Omit<StudentHealth, 'id' | 'lastCalculatedAt'>): Promise<StudentHealth> {
    if (isMongoConnected) {
      const doc = await StudentHealthM.findOneAndUpdate(
        { studentId: data.studentId, enrollmentId: data.enrollmentId },
        { 
          $set: { ...data, lastCalculatedAt: new Date().toISOString() } 
        },
        { new: true, upsert: true }
      )
        .populate('studentId', 'name email role avatar firstName lastName')
        .populate('enrollmentId', 'progressPercentage status enrolledAt');
      return doc.toJSON() as StudentHealth;
    }
    throw new Error('Database not connected');
  }

  async findPaginated(filters: {
    page: number;
    limit: number;
    studentId?: string;
    enrollmentId?: string;
    riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<{ docs: StudentHealth[]; total: number }> {
    if (!isMongoConnected) {
      return { docs: [], total: 0 };
    }

    const { page, limit, studentId, enrollmentId, riskLevel, sortBy, sortOrder } = filters;
    const query: Record<string, any> = {};

    if (studentId) query.studentId = studentId;
    if (enrollmentId) query.enrollmentId = enrollmentId;
    if (riskLevel) query.riskLevel = riskLevel;

    const skip = (page - 1) * limit;

    const total = await StudentHealthM.countDocuments(query);
    const docs = await StudentHealthM.find(query)
      .populate('studentId', 'name email role avatar firstName lastName')
      .populate('enrollmentId', 'progressPercentage status enrolledAt')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    return {
      docs: docs.map((d: any) => d.toJSON() as StudentHealth),
      total
    };
  }
}
