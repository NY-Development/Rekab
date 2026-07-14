import { Router } from 'express';
import { AnnouncementController } from '../controllers/announcementController';
import { AnnouncementService } from '../services/announcementService';
import { AnnouncementRepository } from '../repositories/announcementRepository';
import { requireAuthenticated, authorize } from '../../../middlewares/auth';
import { validateBody } from '../../../middlewares/validation';
import { CreateAnnouncementSchema, UpdateAnnouncementSchema } from '../validators/announcementValidator';

const router = Router();
const announcementRepository = new AnnouncementRepository();
const announcementService = new AnnouncementService(announcementRepository);
const announcementController = new AnnouncementController(announcementService);

// Announcement routes
router.get('/', requireAuthenticated, (req, res, next) => announcementController.listAnnouncements(req, res, next));
router.get('/:id', requireAuthenticated, (req, res, next) => announcementController.getAnnouncementById(req, res, next));
// Mentors are read-only for announcements; instructors are limited to their
// assigned courses/cohorts (ownership asserted in the controller).
router.post('/', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'), validateBody(CreateAnnouncementSchema), (req, res, next) => announcementController.createAnnouncement(req, res, next));
router.put('/:id', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'), validateBody(UpdateAnnouncementSchema), (req, res, next) => announcementController.updateAnnouncement(req, res, next));
router.delete('/:id', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'), (req, res, next) => announcementController.deleteAnnouncement(req, res, next));

export default router;
