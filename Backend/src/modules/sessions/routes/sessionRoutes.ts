import { Router } from 'express';
import { SessionController } from '../controllers/sessionController';
import { SessionService } from '../services/sessionService';
import { SessionRepository } from '../repositories/sessionRepository';
import { requireAuthenticated, authorize } from '../../../middlewares/auth';
import { validateBody } from '../../../middlewares/validation';
import { CreateSessionSchema, UpdateSessionSchema } from '../validators/sessionValidator';

const router = Router();
const sessionRepository = new SessionRepository();
const sessionService = new SessionService(sessionRepository);
const sessionController = new SessionController(sessionService);

// Session routes
router.get('/', requireAuthenticated, (req, res, next) => sessionController.getSessions(req, res, next));
router.get('/:id', requireAuthenticated, (req, res, next) => sessionController.getSessionById(req, res, next));
router.post('/', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'), validateBody(CreateSessionSchema), (req, res, next) => sessionController.createSession(req, res, next));
router.put('/:id', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'), validateBody(UpdateSessionSchema), (req, res, next) => sessionController.updateSession(req, res, next));
router.delete('/:id', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN'), (req, res, next) => sessionController.deleteSession(req, res, next));

export default router;
