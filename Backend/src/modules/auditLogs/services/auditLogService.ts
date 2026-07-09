import { AuditLogRepository } from '../repositories/auditLogRepository';
import { CreateAuditLogDto } from '../dtos/auditLogDto';
import { AuditLog } from '../../../types';
import { AppError } from '../../../middlewares/errorHandler';

export class AuditLogService {
  constructor(private auditLogRepository: AuditLogRepository) {}

  async getAuditLogById(id: string): Promise<AuditLog> {
    const log = await this.auditLogRepository.findById(id);
    if (!log) {
      throw new AppError('Audit log entry not found', 404);
    }
    return log;
  }

  async createAuditLog(data: CreateAuditLogDto): Promise<AuditLog> {
    return this.auditLogRepository.create(data);
  }

  async listAuditLogs(filters: {
    page: number;
    limit: number;
    userId?: string;
    entityType?: string;
    entityId?: string;
    action?: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<{ docs: AuditLog[]; total: number }> {
    return this.auditLogRepository.findPaginated(filters);
  }
}
