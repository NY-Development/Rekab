import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth';
import { AuditLogService } from '../services/auditLogService';
import { CreateAuditLogSchema, AuditLogFilterSchema } from '../validators/auditLogValidator';

export class AuditLogController {
  constructor(private auditLogService: AuditLogService) {}

  async getAuditLogById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const log = await this.auditLogService.getAuditLogById(req.params.id);
      res.status(200).json({ status: 'success', data: log });
    } catch (error) {
      next(error);
    }
  }

  async listAuditLogs(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await AuditLogFilterSchema.parseAsync(req.query);
      const result = await this.auditLogService.listAuditLogs(validated);
      res.status(200).json({
        status: 'success',
        data: {
          docs: result.docs,
          total: result.total,
          page: validated.page,
          limit: validated.limit,
          totalPages: Math.ceil(result.total / validated.limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async createAuditLog(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await CreateAuditLogSchema.parseAsync(req.body);
      const log = await this.auditLogService.createAuditLog(validated);
      res.status(251).json({ status: 'success', data: log });
    } catch (error) {
      next(error);
    }
  }
}
