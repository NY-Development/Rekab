import { Router } from 'express';
import { CurriculumController } from '../controllers/curriculumController';
import { CurriculumService } from '../services/curriculumService';
import { CurriculumRepository } from '../repositories/curriculumRepository';
import { requireAuthenticated, authorize, instructorCourseGuard } from '../../../middlewares/auth';
import { validateBody } from '../../../middlewares/validation';
import { 
  CreateCurriculumSchema, UpdateCurriculumSchema, 
  CreateModuleSchema, UpdateModuleSchema, 
  CreateLessonSchema, UpdateLessonSchema 
} from '../validators/curriculumValidator';

const router = Router();
const curriculumRepository = new CurriculumRepository();
const curriculumService = new CurriculumService(curriculumRepository);
const curriculumController = new CurriculumController(curriculumService);

// Curriculum routes
router.get('/', (req, res, next) => curriculumController.getCurriculums(req, res, next));
router.get('/detail', (req, res, next) => curriculumController.getCurriculumDetail(req, res, next));
router.post('/', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'), instructorCourseGuard, validateBody(CreateCurriculumSchema), (req, res, next) => curriculumController.createCurriculum(req, res, next));
router.put('/:id', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'), instructorCourseGuard, validateBody(UpdateCurriculumSchema), (req, res, next) => curriculumController.updateCurriculum(req, res, next));
router.delete('/:id', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'), instructorCourseGuard, (req, res, next) => curriculumController.deleteCurriculum(req, res, next));

// Module routes
router.get('/modules', (req, res, next) => curriculumController.getModules(req, res, next));
router.post('/modules', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'), instructorCourseGuard, validateBody(CreateModuleSchema), (req, res, next) => curriculumController.createModule(req, res, next));
router.put('/modules/:id', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'), instructorCourseGuard, validateBody(UpdateModuleSchema), (req, res, next) => curriculumController.updateModule(req, res, next));
router.delete('/modules/:id', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'), instructorCourseGuard, (req, res, next) => curriculumController.deleteModule(req, res, next));

// Lesson routes
router.get('/lessons', (req, res, next) => curriculumController.getLessons(req, res, next));
router.post('/lessons', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'), instructorCourseGuard, validateBody(CreateLessonSchema), (req, res, next) => curriculumController.createLesson(req, res, next));
router.put('/lessons/:id', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'), instructorCourseGuard, validateBody(UpdateLessonSchema), (req, res, next) => curriculumController.updateLesson(req, res, next));
router.delete('/lessons/:id', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'), instructorCourseGuard, (req, res, next) => curriculumController.deleteLesson(req, res, next));

export default router;
