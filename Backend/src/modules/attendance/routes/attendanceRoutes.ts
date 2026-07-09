import { Router } from 'express';
import { AttendanceController } from '../controllers/attendanceController';
import { AttendanceService } from '../services/attendanceService';
import { AttendanceRepository } from '../repositories/attendanceRepository';
import { requireAuthenticated, authorize } from '../../../middlewares/auth';
import { validateBody } from '../../../middlewares/validation';
import { SaveAttendanceSchema, BulkAttendanceSchema } from '../validators/attendanceValidator';

const router = Router();
const attendanceRepository = new AttendanceRepository();
const attendanceService = new AttendanceService(attendanceRepository);
const attendanceController = new AttendanceController(attendanceService);

// Attendance routes
router.get('/me', requireAuthenticated, (req, res, next) => attendanceController.getMyAttendance(req, res, next));
router.get('/session/:sessionId', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR', 'MENTOR'), (req, res, next) => attendanceController.getSessionAttendance(req, res, next));
router.get('/', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR', 'MENTOR'), (req, res, next) => attendanceController.listAttendance(req, res, next));
router.get('/:id', requireAuthenticated, (req, res, next) => attendanceController.getAttendanceById(req, res, next));

router.post('/', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR', 'MENTOR'), validateBody(SaveAttendanceSchema), (req, res, next) => attendanceController.markAttendance(req, res, next));
router.post('/bulk', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR', 'MENTOR'), validateBody(BulkAttendanceSchema), (req, res, next) => attendanceController.bulkMarkAttendance(req, res, next));
router.delete('/:id', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN'), (req, res, next) => attendanceController.deleteAttendance(req, res, next));

export default router;
