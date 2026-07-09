import { Router } from 'express';
import { StudentController } from '../controllers/studentController';
import { StudentService } from '../services/studentService';
import { StudentRepository } from '../repositories/studentRepository';
import { requireAuthenticated, authorize } from '../../../middlewares/auth';
import { validateBody } from '../../../middlewares/validation';
import { CreateStudentProfileSchema, UpdateStudentProfileSchema } from '../validators/studentValidator';

const router = Router();
const studentRepository = new StudentRepository();
const studentService = new StudentService(studentRepository);
const studentController = new StudentController(studentService);

// Student routes
router.get('/me', requireAuthenticated, (req, res, next) => studentController.getMyProfile(req, res, next));
router.get('/', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'), (req, res, next) => studentController.listStudents(req, res, next));
router.get('/:id', requireAuthenticated, (req, res, next) => studentController.getProfileById(req, res, next));
router.post('/', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN'), validateBody(CreateStudentProfileSchema), (req, res, next) => studentController.createProfile(req, res, next));
router.put('/:id', requireAuthenticated, validateBody(UpdateStudentProfileSchema), (req, res, next) => studentController.updateProfile(req, res, next));

export default router;
