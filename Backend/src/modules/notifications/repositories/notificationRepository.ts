import NotificationModel from '../models/Notification';
import { Notification } from '../../../types';
import { isMongoConnected } from '../../../configs/db';

const NotificationM = NotificationModel as any;

export class NotificationRepository {
  async findById(id: string): Promise<Notification | null> {
    if (isMongoConnected) {
      const doc = await NotificationM.findById(id).populate('userId', 'name email role avatar');
      return doc ? (doc.toJSON() as Notification) : null;
    }
    return null;
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    if (isMongoConnected) {
      const docs = await NotificationM.find({ userId }).sort({ sentAt: -1 });
      return docs.map((d: any) => d.toJSON() as Notification);
    }
    return [];
  }

  async create(data: Omit<Notification, 'id' | 'isRead' | 'sentAt'>): Promise<Notification> {
    if (isMongoConnected) {
      const doc = await NotificationM.create({
        ...data,
        isRead: false,
      });
      return doc.toJSON() as Notification;
    }
    throw new Error('Database not connected');
  }

  async markAsRead(id: string): Promise<Notification | null> {
    if (isMongoConnected) {
      const doc = await NotificationM.findByIdAndUpdate(
        id,
        { $set: { isRead: true } },
        { new: true }
      ).populate('userId', 'name email role avatar');
      return doc ? (doc.toJSON() as Notification) : null;
    }
    return null;
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    if (isMongoConnected) {
      const result = await NotificationM.updateMany(
        { userId, isRead: false },
        { $set: { isRead: true } }
      );
      return !!result;
    }
    return false;
  }

  async delete(id: string): Promise<boolean> {
    if (isMongoConnected) {
      const result = await NotificationM.findByIdAndDelete(id);
      return !!result;
    }
    return false;
  }

  async findPaginated(filters: {
    page: number;
    limit: number;
    userId?: string;
    isRead?: boolean;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<{ docs: Notification[]; total: number }> {
    if (!isMongoConnected) {
      return { docs: [], total: 0 };
    }

    const { page, limit, userId, isRead, sortBy, sortOrder } = filters;
    const query: Record<string, any> = {};

    if (userId) query.userId = userId;
    if (typeof isRead === 'boolean') query.isRead = isRead;

    const skip = (page - 1) * limit;

    const total = await NotificationM.countDocuments(query);
    const docs = await NotificationM.find(query)
      .populate('userId', 'name email role avatar')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    return {
      docs: docs.map((d: any) => d.toJSON() as Notification),
      total
    };
  }
}
