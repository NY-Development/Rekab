import { Router } from 'express';
import { AssignmentController } from '../controllers/assignmentController';
import { AssignmentService } from '../services/assignmentService';
import { AssignmentRepository } from '../repositories/assignmentRepository';
import { requireAuthenticated, authorize } from '../../../middlewares/auth';
import { validateBody } from '../../../middlewares/validation';
import { CreateAssignmentSchema, UpdateAssignmentSchema } from '../validators/assignmentValidator';

const router = Router();
const assignmentRepository = new AssignmentRepository();
const assignmentService = new AssignmentService(assignmentRepository);
const assignmentController = new AssignmentController(assignmentService);

// Assignment routes
router.get('/', requireAuthenticated, (req, res, next) => assignmentController.listAssignments(req, res, next));
router.get('/:id', requireAuthenticated, (req, res, next) => assignmentController.getAssignmentById(req, res, next));
router.post('/', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'), validateBody(CreateAssignmentSchema), (req, res, next) => assignmentController.createAssignment(req, res, next));
router.put('/:id', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'), validateBody(UpdateAssignmentSchema), (req, res, next) => assignmentController.updateAssignment(req, res, next));
router.delete('/:id', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN'), (req, res, next) => assignmentController.deleteAssignment(req, res, next));

export default router;
