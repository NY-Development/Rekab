import { Router } from 'express';
import { MentorController } from '../controllers/mentorController';
import { MentorService } from '../services/mentorService';
import { MentorRepository } from '../repositories/mentorRepository';
import { requireAuthenticated, authorize } from '../../../middlewares/auth';
import { validateBody } from '../../../middlewares/validation';
import { CreateMentorProfileSchema, UpdateMentorProfileSchema } from '../validators/mentorValidator';

const router = Router();
const mentorRepository = new MentorRepository();
const mentorService = new MentorService(mentorRepository);
const mentorController = new MentorController(mentorService);

// Mentor routes
router.get('/me', requireAuthenticated, (req, res, next) => mentorController.getMyProfile(req, res, next));
router.get('/', requireAuthenticated, (req, res, next) => mentorController.listMentors(req, res, next));
router.get('/:id', requireAuthenticated, (req, res, next) => mentorController.getProfileById(req, res, next));
router.post('/', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN'), validateBody(CreateMentorProfileSchema), (req, res, next) => mentorController.createProfile(req, res, next));
router.put('/:id', requireAuthenticated, validateBody(UpdateMentorProfileSchema), (req, res, next) => mentorController.updateProfile(req, res, next));
router.delete('/:id', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN'), (req, res, next) => mentorController.deleteProfile(req, res, next));

export default router;
