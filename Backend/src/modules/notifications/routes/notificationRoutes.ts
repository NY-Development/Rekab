import { Router } from 'express';
import { NotificationController } from '../controllers/notificationController';
import { NotificationService } from '../services/notificationService';
import { NotificationRepository } from '../repositories/notificationRepository';
import { requireAuthenticated, authorize } from '../../../middlewares/auth';
import { validateBody } from '../../../middlewares/validation';
import { CreateNotificationSchema } from '../validators/notificationValidator';

const router = Router();
const notificationRepository = new NotificationRepository();
const notificationService = new NotificationService(notificationRepository);
const notificationController = new NotificationController(notificationService);

// Notification routes
router.get('/me', requireAuthenticated, (req, res, next) => notificationController.getMyNotifications(req, res, next));
router.post('/me/read-all', requireAuthenticated, (req, res, next) => notificationController.markAllAsRead(req, res, next));
router.get('/', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN'), (req, res, next) => notificationController.listNotifications(req, res, next));
router.get('/:id', requireAuthenticated, (req, res, next) => notificationController.getNotificationById(req, res, next));
router.post('/', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'), validateBody(CreateNotificationSchema), (req, res, next) => notificationController.createNotification(req, res, next));
router.put('/:id/read', requireAuthenticated, (req, res, next) => notificationController.markAsRead(req, res, next));

export default router;
