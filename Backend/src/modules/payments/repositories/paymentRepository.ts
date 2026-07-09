import PaymentModel from '../models/Payment';
import { Payment } from '../../../types';
import { isMongoConnected } from '../../../configs/db';

const PaymentM = PaymentModel as any;

export class PaymentRepository {
  async findById(id: string): Promise<Payment | null> {
    if (isMongoConnected) {
      const doc = await PaymentM.findById(id)
        .populate('studentId', 'name email role avatar firstName lastName username')
        .populate('courseId', 'title category slug thumbnail price code')
        .populate('enrollmentId', 'progressPercentage status enrolledAt');
      return doc ? (doc.toJSON() as Payment) : null;
    }
    return null;
  }

  async findByTransactionReference(transactionReference: string): Promise<Payment | null> {
    if (isMongoConnected) {
      const doc = await PaymentM.findOne({ transactionReference })
        .populate('studentId', 'name email role avatar firstName lastName username')
        .populate('courseId', 'title category slug thumbnail price code')
        .populate('enrollmentId', 'progressPercentage status enrolledAt');
      return doc ? (doc.toJSON() as Payment) : null;
    }
    return null;
  }

  async create(data: Omit<Payment, 'id' | 'createdAt' | 'updatedAt' | 'verifiedBy' | 'verificationDate'>): Promise<Payment> {
    if (isMongoConnected) {
      const doc = await PaymentM.create({
        ...data,
        status: data.status || 'PENDING',
      });
      return doc.toJSON() as Payment;
    }
    throw new Error('Database not connected');
  }

  async update(id: string, updateData: Partial<Payment>): Promise<Payment | null> {
    if (isMongoConnected) {
      const doc = await PaymentM.findByIdAndUpdate(
        id,
        { $set: { ...updateData, updatedAt: new Date().toISOString() } },
        { new: true }
      )
        .populate('studentId', 'name email role avatar firstName lastName username')
        .populate('courseId', 'title category slug thumbnail price code')
        .populate('enrollmentId', 'progressPercentage status enrolledAt');
      return doc ? (doc.toJSON() as Payment) : null;
    }
    return null;
  }

  async findPaginated(filters: {
    page: number;
    limit: number;
    studentId?: string;
    courseId?: string;
    enrollmentId?: string;
    status?: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<{ docs: Payment[]; total: number }> {
    if (!isMongoConnected) {
      return { docs: [], total: 0 };
    }

    const { page, limit, studentId, courseId, enrollmentId, status, sortBy, sortOrder } = filters;
    const query: Record<string, any> = {};

    if (studentId) query.studentId = studentId;
    if (courseId) query.courseId = courseId;
    if (enrollmentId) query.enrollmentId = enrollmentId;
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const total = await PaymentM.countDocuments(query);
    const docs = await PaymentM.find(query)
      .populate('studentId', 'name email role avatar firstName lastName username')
      .populate('courseId', 'title category slug thumbnail price code')
      .populate('enrollmentId', 'progressPercentage status enrolledAt')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    return {
      docs: docs.map((d: any) => d.toJSON() as Payment),
      total
    };
  }
}
