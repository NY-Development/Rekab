import { Router } from 'express';
import { EnrollmentController } from '../controllers/enrollmentController';
import { EnrollmentService } from '../services/enrollmentService';
import { EnrollmentRepository } from '../repositories/enrollmentRepository';
import { CohortRepository } from '../../cohorts/repositories/cohortRepository';
import { CourseRepository } from '../../courses/repositories/courseRepository';
import { requireAuthenticated, authorize } from '../../../middlewares/auth';
import { validateBody } from '../../../middlewares/validation';
import { UpdateEnrollmentSchema } from '../validators/enrollmentValidator';

const router = Router();
const enrollmentRepository = new EnrollmentRepository();
const cohortRepository = new CohortRepository();
const courseRepository = new CourseRepository();
const enrollmentService = new EnrollmentService(enrollmentRepository, cohortRepository, courseRepository);
const enrollmentController = new EnrollmentController(enrollmentService);

// Enrollment / registration routes
router.get('/me', requireAuthenticated, (req, res, next) => enrollmentController.getMyEnrollments(req, res, next));
router.get('/', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'), (req, res, next) => enrollmentController.listEnrollments(req, res, next));
router.get('/:id', requireAuthenticated, (req, res, next) => enrollmentController.getEnrollmentById(req, res, next));
// Note: no validateBody() here — CreateEnrollmentSchema requires studentId, which the
// controller injects from the authenticated user before validating (see apply() below).
router.post('/apply', requireAuthenticated, (req, res, next) => enrollmentController.apply(req, res, next));
router.put('/:id', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'), validateBody(UpdateEnrollmentSchema), (req, res, next) => enrollmentController.updateEnrollment(req, res, next));
router.patch('/:id/approve', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN'), (req, res, next) => enrollmentController.approveRegistration(req, res, next));
router.patch('/:id/reject', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN'), (req, res, next) => enrollmentController.rejectRegistration(req, res, next));
router.patch('/:id/grant-access', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN'), (req, res, next) => enrollmentController.grantAccess(req, res, next));
router.patch('/:id/suspend', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN'), (req, res, next) => enrollmentController.suspendAccess(req, res, next));
router.delete('/:id', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN'), (req, res, next) => enrollmentController.deleteEnrollment(req, res, next));

export default router;
