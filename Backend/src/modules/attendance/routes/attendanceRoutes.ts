import { Router } from 'express';
import { AttendanceController } from '../controllers/attendanceController';
import { AttendanceService } from '../services/attendanceService';
import { AttendanceRepository } from '../repositories/attendanceRepository';
import { SessionRepository } from '../../sessions/repositories/sessionRepository';
import { EnrollmentRepository } from '../../enrollments/repositories/enrollmentRepository';
import { requireAuthenticated, authorize } from '../../../middlewares/auth';
import { validateBody } from '../../../middlewares/validation';
import { multerUpload } from '../../../middlewares/uploadMiddleware';
import { SaveAttendanceSchema, BulkAttendanceSchema } from '../validators/attendanceValidator';

const router = Router();
const attendanceRepository = new AttendanceRepository();
const sessionRepository = new SessionRepository();
const enrollmentRepository = new EnrollmentRepository();
const attendanceService = new AttendanceService(attendanceRepository, sessionRepository, enrollmentRepository);
const attendanceController = new AttendanceController(attendanceService);

// Attendance routes
router.get('/me', requireAuthenticated, (req, res, next) => attendanceController.getMyAttendance(req, res, next));
// Student records clicking a session's join link.
router.post('/join', requireAuthenticated, (req, res, next) => attendanceController.recordJoin(req, res, next));
// Instructor/admin imports a Google Meet attendance report (CSV/XLSX).
router.post(
  '/session/:sessionId/import',
  requireAuthenticated,
  authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'),
  multerUpload.single('file'),
  (req, res, next) => attendanceController.importAttendance(req as any, res, next)
);
router.get('/session/:sessionId', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR', 'MENTOR'), (req, res, next) => attendanceController.getSessionAttendance(req, res, next));
router.get('/', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR', 'MENTOR'), (req, res, next) => attendanceController.listAttendance(req, res, next));
router.get('/:id', requireAuthenticated, (req, res, next) => attendanceController.getAttendanceById(req, res, next));

// Mentors are view-only for attendance; instructors are limited to sessions
// in their assigned cohorts (ownership asserted in the controller).
router.post('/', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'), validateBody(SaveAttendanceSchema), (req, res, next) => attendanceController.markAttendance(req, res, next));
router.post('/bulk', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'), validateBody(BulkAttendanceSchema), (req, res, next) => attendanceController.bulkMarkAttendance(req, res, next));
router.delete('/:id', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN'), (req, res, next) => attendanceController.deleteAttendance(req, res, next));

export default router;
