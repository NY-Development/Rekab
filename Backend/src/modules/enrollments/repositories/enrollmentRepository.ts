import EnrollmentModel from '../models/Enrollment';
import { Enrollment } from '../../../types';
import { isMongoConnected } from '../../../configs/db';

const EnrollmentM = EnrollmentModel as any;

export class EnrollmentRepository {
  async findById(id: string): Promise<Enrollment | null> {
    if (isMongoConnected) {
      const doc = await EnrollmentM.findById(id)
        .populate('studentId', 'name email role avatar firstName lastName username')
        .populate('courseId', 'title category slug thumbnail price code')
        .populate('cohortId', 'name code startDate endDate status')
        .populate('teamId', 'name teamCode score')
        .populate('paymentId', 'amount status transactionReference paidAt');
      return doc ? (doc.toJSON() as Enrollment) : null;
    }
    return null;
  }

  async findByStudentAndCourse(studentId: string, courseId: string): Promise<Enrollment | null> {
    if (isMongoConnected) {
      const doc = await EnrollmentM.findOne({ studentId, courseId })
        .populate('studentId', 'name email role avatar firstName lastName username')
        .populate('courseId', 'title category slug thumbnail price code')
        .populate('cohortId', 'name code startDate endDate status')
        .populate('teamId', 'name teamCode score')
        .populate('paymentId', 'amount status transactionReference paidAt');
      return doc ? (doc.toJSON() as Enrollment) : null;
    }
    return null;
  }

  async findByStudentAndCohort(studentId: string, cohortId: string): Promise<Enrollment | null> {
    if (isMongoConnected) {
      const doc = await EnrollmentM.findOne({ studentId, cohortId })
        .populate('studentId', 'name email role avatar firstName lastName username')
        .populate('courseId', 'title category slug thumbnail price code')
        .populate('cohortId', 'name code startDate endDate status')
        .populate('teamId', 'name teamCode score')
        .populate('paymentId', 'amount status transactionReference paidAt');
      return doc ? (doc.toJSON() as Enrollment) : null;
    }
    return null;
  }

  async create(data: Omit<Enrollment, 'id' | 'progressPercentage' | 'certificateIssued' | 'certificateUrl' | 'enrolledAt' | 'completedAt' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Enrollment> {
    if (isMongoConnected) {
      const doc = await EnrollmentM.create({
        ...data,
        progressPercentage: 0,
        certificateIssued: false,
        status: 'PENDING',
      });
      return doc.toJSON() as Enrollment;
    }
    throw new Error('Database not connected');
  }

  async update(id: string, updateData: Partial<Enrollment>): Promise<Enrollment | null> {
    if (isMongoConnected) {
      const doc = await EnrollmentM.findByIdAndUpdate(
        id,
        { $set: { ...updateData, updatedAt: new Date().toISOString() } },
        { new: true }
      )
        .populate('studentId', 'name email role avatar firstName lastName username')
        .populate('courseId', 'title category slug thumbnail price code')
        .populate('cohortId', 'name code startDate endDate status')
        .populate('teamId', 'name teamCode score')
        .populate('paymentId', 'amount status transactionReference paidAt');
      return doc ? (doc.toJSON() as Enrollment) : null;
    }
    return null;
  }

  async delete(id: string): Promise<boolean> {
    if (isMongoConnected) {
      const result = await EnrollmentM.findByIdAndDelete(id);
      return !!result;
    }
    return false;
  }

  async findPaginated(filters: {
    page: number;
    limit: number;
    studentId?: string;
    courseId?: string;
    cohortId?: string;
    status?: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<{ docs: Enrollment[]; total: number }> {
    if (!isMongoConnected) {
      return { docs: [], total: 0 };
    }

    const { page, limit, studentId, courseId, cohortId, status, sortBy, sortOrder } = filters;
    const query: Record<string, any> = {};

    if (studentId) query.studentId = studentId;
    if (courseId) query.courseId = courseId;
    if (cohortId) query.cohortId = cohortId;
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const total = await EnrollmentM.countDocuments(query);
    const docs = await EnrollmentM.find(query)
      .populate('studentId', 'name email role avatar firstName lastName username')
      .populate('courseId', 'title category slug thumbnail price code')
      .populate('cohortId', 'name code startDate endDate status')
      .populate('teamId', 'name teamCode score')
      .populate('paymentId', 'amount status transactionReference paidAt')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    return {
      docs: docs.map((d: any) => d.toJSON() as Enrollment),
      total
    };
  }
}
