import { Router } from 'express';
import { PaymentController } from '../controllers/paymentController';
import { PaymentService } from '../services/paymentService';
import { PaymentRepository } from '../repositories/paymentRepository';
import { EnrollmentRepository } from '../../enrollments/repositories/enrollmentRepository';
import { CourseRepository } from '../../courses/repositories/courseRepository';
import { requireAuthenticated, authorize } from '../../../middlewares/auth';
import { validateBody } from '../../../middlewares/validation';
import { SubmitPaymentSchema, AdminVerifyPaymentSchema } from '../validators/paymentValidator';

const router = Router();
const paymentRepository = new PaymentRepository();
const enrollmentRepository = new EnrollmentRepository();
const courseRepository = new CourseRepository();
const paymentService = new PaymentService(paymentRepository, enrollmentRepository, courseRepository);
const paymentController = new PaymentController(paymentService);

// Payment routes
router.get('/me', requireAuthenticated, (req, res, next) => paymentController.getMyPayments(req, res, next));
router.get('/', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'), (req, res, next) => paymentController.listPayments(req, res, next));
router.get('/:id', requireAuthenticated, (req, res, next) => paymentController.getPaymentById(req, res, next));
router.post('/submit', requireAuthenticated, validateBody(SubmitPaymentSchema), (req, res, next) => paymentController.submitPayment(req, res, next));
router.put('/:id/verify', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN'), validateBody(AdminVerifyPaymentSchema), (req, res, next) => paymentController.adminVerifyPayment(req, res, next));

export default router;
