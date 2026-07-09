import { Router, Request, Response, NextFunction } from 'express';
import { SubmissionController } from '../controllers/submissionController';
import { SubmissionService } from '../services/submissionService';
import { SubmissionRepository } from '../repositories/submissionRepository';
import { requireAuthenticated, authorize, AuthenticatedRequest } from '../../../middlewares/auth';
import { validateBody } from '../../../middlewares/validation';
import { SubmissionSchema, GradeSchema } from '../validators/submissionValidator';

const router = Router();
const submissionRepository = new SubmissionRepository();
const submissionService = new SubmissionService(submissionRepository);
const submissionController = new SubmissionController(submissionService);

const requireStaff = authorize('ADMIN', 'MENTOR', 'INSTRUCTOR', 'SUPER_ADMIN');
const requireInstructor = authorize('INSTRUCTOR');

router.post('/', requireAuthenticated, validateBody(SubmissionSchema), (req, res, next) => submissionController.submitAssignment(req, res, next));
router.get('/', requireStaff, (req, res, next) => submissionController.listSubmissions(req, res, next));
router.get('/mine', requireAuthenticated, (req: Request, res: Response, next: NextFunction) => {
// Cast req to AuthenticatedRequest to access req.user
  const authReq = req as AuthenticatedRequest;
  
  if (authReq.user) {
    req.query.studentId = authReq.user.id;
  }
  
  next();
}, (req, res, next) => submissionController.listSubmissions(req, res, next));
router.post('/:id/grade', requireInstructor, validateBody(GradeSchema), (req, res, next) => submissionController.gradeSubmission(req, res, next));

export default router;
