import { Router } from 'express';
import { AuditLogController } from '../controllers/auditLogController';
import { AuditLogService } from '../services/auditLogService';
import { AuditLogRepository } from '../repositories/auditLogRepository';
import { requireAuthenticated, authorize } from '../../../middlewares/auth';
import { validateBody } from '../../../middlewares/validation';
import { CreateAuditLogSchema } from '../validators/auditLogValidator';

const router = Router();
const auditLogRepository = new AuditLogRepository();
const auditLogService = new AuditLogService(auditLogRepository);
const auditLogController = new AuditLogController(auditLogService);

// Audit log routes
router.get('/', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN'), (req, res, next) => auditLogController.listAuditLogs(req, res, next));
router.get('/:id', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN'), (req, res, next) => auditLogController.getAuditLogById(req, res, next));
router.post('/', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN'), validateBody(CreateAuditLogSchema), (req, res, next) => auditLogController.createAuditLog(req, res, next));

export default router;
