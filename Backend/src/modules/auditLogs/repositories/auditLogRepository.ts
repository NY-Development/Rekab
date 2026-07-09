import AuditLogModel from '../models/AuditLog';
import { AuditLog } from '../../../types';
import { isMongoConnected } from '../../../configs/db';

const AuditLogM = AuditLogModel as any;

export class AuditLogRepository {
  async findById(id: string): Promise<AuditLog | null> {
    if (isMongoConnected) {
      const doc = await AuditLogM.findById(id).populate('userId', 'name email role avatar');
      return doc ? (doc.toJSON() as AuditLog) : null;
    }
    return null;
  }

  async create(data: Omit<AuditLog, 'id' | 'createdAt'>): Promise<AuditLog> {
    if (isMongoConnected) {
      const doc = await AuditLogM.create(data);
      return doc.toJSON() as AuditLog;
    }
    throw new Error('Database not connected');
  }

  async findPaginated(filters: {
    page: number;
    limit: number;
    userId?: string;
    entityType?: string;
    entityId?: string;
    action?: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<{ docs: AuditLog[]; total: number }> {
    if (!isMongoConnected) {
      return { docs: [], total: 0 };
    }

    const { page, limit, userId, entityType, entityId, action, sortBy, sortOrder } = filters;
    const query: Record<string, any> = {};

    if (userId) query.userId = userId;
    if (entityType) query.entityType = entityType;
    if (entityId) query.entityId = entityId;
    if (action) query.action = action;

    const skip = (page - 1) * limit;

    const total = await AuditLogM.countDocuments(query);
    const docs = await AuditLogM.find(query)
      .populate('userId', 'name email role avatar')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    return {
      docs: docs.map((d: any) => d.toJSON() as AuditLog),
      total
    };
  }
}
