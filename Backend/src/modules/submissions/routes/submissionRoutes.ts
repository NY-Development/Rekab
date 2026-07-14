import { Router, Request, Response, NextFunction } from 'express';
import { SubmissionController } from '../controllers/submissionController';
import { SubmissionService } from '../services/submissionService';
import { SubmissionRepository } from '../repositories/submissionRepository';
import { AssignmentRepository } from '../../assignments/repositories/assignmentRepository';
import { EnrollmentRepository } from '../../enrollments/repositories/enrollmentRepository';
import { requireAuthenticated, authorize, AuthenticatedRequest } from '../../../middlewares/auth';
import { validateBody } from '../../../middlewares/validation';
import { SubmissionSchema, GradeSchema } from '../validators/submissionValidator';

const router = Router();
const submissionRepository = new SubmissionRepository();
const assignmentRepository = new AssignmentRepository();
const enrollmentRepository = new EnrollmentRepository();
const submissionService = new SubmissionService(submissionRepository, assignmentRepository, enrollmentRepository);
const submissionController = new SubmissionController(submissionService);

const requireStaff = authorize('ADMIN', 'MENTOR', 'INSTRUCTOR', 'SUPER_ADMIN');
const requireInstructor = authorize('INSTRUCTOR');

router.post('/', requireAuthenticated, validateBody(SubmissionSchema), (req, res, next) => submissionController.submitAssignment(req, res, next));
router.get('/', requireAuthenticated, requireStaff, (req, res, next) => submissionController.listSubmissions(req, res, next));
router.get('/mine', requireAuthenticated, (req: Request, res: Response, next: NextFunction) => {
// Cast req to AuthenticatedRequest to access req.user
  const authReq = req as AuthenticatedRequest;
  
  if (authReq.user) {
    req.query.studentId = authReq.user.id;
  }
  
  next();
}, (req, res, next) => submissionController.listSubmissions(req, res, next));
// Admins may grade anywhere; instructors only within assigned cohorts (asserted in the service).
router.post('/:id/grade', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'), validateBody(GradeSchema), (req, res, next) => submissionController.gradeSubmission(req, res, next));

export default router;
