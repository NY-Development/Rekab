import { Router } from 'express';
import { InstructorController } from '../controllers/instructorController';
import { InstructorService } from '../services/instructorService';
import { InstructorRepository } from '../repositories/instructorRepository';
import { requireAuthenticated, authorize } from '../../../middlewares/auth';
import { validateBody } from '../../../middlewares/validation';
import { CreateInstructorProfileSchema, UpdateInstructorProfileSchema } from '../validators/instructorValidator';

const router = Router();
const instructorRepository = new InstructorRepository();
const instructorService = new InstructorService(instructorRepository);
const instructorController = new InstructorController(instructorService);

// Instructor routes
router.get('/me', requireAuthenticated, (req, res, next) => instructorController.getMyProfile(req, res, next));
router.get('/', requireAuthenticated, (req, res, next) => instructorController.listInstructors(req, res, next));
router.get('/:id', requireAuthenticated, (req, res, next) => instructorController.getProfileById(req, res, next));
router.post('/', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN'), validateBody(CreateInstructorProfileSchema), (req, res, next) => instructorController.createProfile(req, res, next));
router.put('/:id', requireAuthenticated, validateBody(UpdateInstructorProfileSchema), (req, res, next) => instructorController.updateProfile(req, res, next));

export default router;
