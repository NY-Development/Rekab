import { Router, Response, NextFunction } from 'express';
import { SessionController } from '../controllers/sessionController';
import { SessionService } from '../services/sessionService';
import { SessionRepository } from '../repositories/sessionRepository';
import { requireAuthenticated, authorize, AuthenticatedRequest } from '../../../middlewares/auth';
import { validateBody } from '../../../middlewares/validation';
import { CreateSessionSchema, UpdateSessionSchema } from '../validators/sessionValidator';
import { uploadFileToCloudinary, UploadedFileRequest } from '../../../middlewares/uploadMiddleware';

const router = Router();
const sessionRepository = new SessionRepository();
const sessionService = new SessionService(sessionRepository);
const sessionController = new SessionController(sessionService);

// Helper middleware to inject the uploaded Cloudinary recording URL into req.body.recordingLink
const injectRecordingLink = (req: UploadedFileRequest, res: Response, next: NextFunction) => {
  if (req.fileUrl) {
    req.body.recordingLink = req.fileUrl;
  }
  next();
};

// Session routes
router.get('/', requireAuthenticated, (req, res, next) => sessionController.getSessions(req, res, next));
router.get('/:id', requireAuthenticated, (req, res, next) => sessionController.getSessionById(req, res, next));
router.post(
  '/',
  requireAuthenticated,
  authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'),
  uploadFileToCloudinary('recording', 'nydl/sessions'),
  injectRecordingLink as any,
  validateBody(CreateSessionSchema),
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => sessionController.createSession(req, res, next)
);
router.put(
  '/:id',
  requireAuthenticated,
  authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'),
  uploadFileToCloudinary('recording', 'nydl/sessions'),
  injectRecordingLink as any,
  validateBody(UpdateSessionSchema),
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => sessionController.updateSession(req, res, next)
);
// Instructors may delete only sessions in their assigned cohorts (asserted in the controller).
router.delete('/:id', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'), (req, res, next) => sessionController.deleteSession(req, res, next));

export default router;
