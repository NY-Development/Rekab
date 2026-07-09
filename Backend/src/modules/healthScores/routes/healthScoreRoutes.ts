import { Router } from 'express';
import { HealthScoreController } from '../controllers/healthScoreController';
import { HealthScoreService } from '../services/healthScoreService';
import { StudentHealthRepository } from '../repositories/studentHealthRepository';
import { AttendanceRepository } from '../../attendance/repositories/attendanceRepository';
import { AssignmentRepository } from '../../assignments/repositories/assignmentRepository';
import { SubmissionRepository } from '../../submissions/repositories/submissionRepository';
import { EnrollmentRepository } from '../../enrollments/repositories/enrollmentRepository';
import { requireAuthenticated, authorize } from '../../../middlewares/auth';
import { validateBody } from '../../../middlewares/validation';
import { UpdateStudentHealthSchema } from '../validators/healthScoreValidator';

const router = Router();
const studentHealthRepository = new StudentHealthRepository();
const attendanceRepository = new AttendanceRepository();
const assignmentRepository = new AssignmentRepository();
const submissionRepository = new SubmissionRepository();
const enrollmentRepository = new EnrollmentRepository();

const healthScoreService = new HealthScoreService(
  studentHealthRepository,
  attendanceRepository,
  assignmentRepository,
  submissionRepository,
  enrollmentRepository
);
const healthScoreController = new HealthScoreController(healthScoreService);

// Health Score endpoints
router.get('/', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'), (req, res, next) => healthScoreController.listHealthRecords(req, res, next));
router.get('/student/:studentId/enrollment/:enrollmentId', requireAuthenticated, (req, res, next) => healthScoreController.getStudentHealth(req, res, next));
router.get('/:id', requireAuthenticated, (req, res, next) => healthScoreController.getHealthById(req, res, next));

router.post('/recalculate', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'), (req, res, next) => healthScoreController.recalculateScore(req, res, next));
router.put('/student/:studentId/enrollment/:enrollmentId', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'), validateBody(UpdateStudentHealthSchema), (req, res, next) => healthScoreController.updateManualScores(req, res, next));

export default router;
