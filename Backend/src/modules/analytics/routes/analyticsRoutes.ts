import { Router } from 'express';
import { AnalyticsController } from '../controllers/analyticsController';
import { AnalyticsService } from '../services/analyticsService';
import { AnalyticsRepository } from '../repositories/analyticsRepository';
import { requireAuthenticated, authorize } from '../../../middlewares/auth';
import { validateBody } from '../../../middlewares/validation';
import { LogStudentActivitySchema } from '../validators/analyticsValidator';

const router = Router();
const analyticsRepository = new AnalyticsRepository();
const analyticsService = new AnalyticsService(analyticsRepository);
const analyticsController = new AnalyticsController(analyticsService);

// Analytics endpoints
router.post('/activity', requireAuthenticated, validateBody(LogStudentActivitySchema), (req, res, next) => analyticsController.logStudentActivity(req, res, next));
router.get('/activities', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'), (req, res, next) => analyticsController.getStudentActivities(req, res, next));
router.get('/system-logs', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN'), (req, res, next) => analyticsController.getActivityLogs(req, res, next));

export default router;
