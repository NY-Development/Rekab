import { Router } from 'express';
import { ContactController } from '../controllers/contactController';
import { ContactService } from '../services/contactService';
import { requireAuthenticated, authorize, optionalAuth } from '../../../middlewares/auth';
import { validateBody } from '../../../middlewares/validation';
import { CreateContactSchema } from '../validators/contactValidator';

const router = Router();
const contactService = new ContactService();
const contactController = new ContactController(contactService);

// Public: anyone can submit a contact/help message (identity attached if signed in).
router.post('/', optionalAuth, validateBody(CreateContactSchema), (req, res, next) =>
  contactController.submit(req, res, next)
);

// Admin: review submitted messages.
router.get('/', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN'), (req, res, next) =>
  contactController.list(req, res, next)
);
router.get('/unread-count', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN'), (req, res, next) =>
  contactController.unreadCount(req, res, next)
);
router.patch('/:id/handled', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN'), (req, res, next) =>
  contactController.markHandled(req, res, next)
);

export default router;
