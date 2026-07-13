import { Router } from 'express';
import { CourseController } from '../controllers/courseController';
import { CourseService } from '../services/courseService';
import { CourseRepository } from '../repositories/courseRepository';
import { requireAdmin, requireInstructor } from '../../../middlewares/auth';
import { validateBody } from '../../../middlewares/validation';
import {
  CourseSchema,
  ModuleSchema,
  LessonSchema,
  AssignmentSchema
} from '../validators/courseValidator';

const router = Router();
const courseRepository = new CourseRepository();
const courseService = new CourseService(courseRepository);
const courseController = new CourseController(courseService);

router.get('/', (req, res, next) => courseController.listCourses(req, res, next));
router.get('/:id', (req, res, next) => courseController.getCourseDetails(req, res, next));
router.post('/', requireAdmin, validateBody(CourseSchema), (req, res, next) => courseController.createCourse(req, res, next));
router.put('/:id', requireAdmin, (req, res, next) => courseController.updateCourse(req, res, next));
router.delete('/:id', requireAdmin, (req, res, next) => courseController.deleteCourse(req, res, next));
router.post(
  '/:courseId/modules',
  requireInstructor,
  validateBody(ModuleSchema),
  (req, res, next) => courseController.addModuleToCourse(req, res, next)
);
router.post(
  '/:courseId/modules/:moduleId/lessons',
  requireInstructor,
  validateBody(LessonSchema),
  (req, res, next) => courseController.addLessonToModule(req, res, next)
);
router.post(
  '/:courseId/modules/:moduleId/assignments',
  requireInstructor,
  validateBody(AssignmentSchema),
  (req, res, next) => courseController.addAssignmentToModule(req, res, next)
);

export default router;
