import { Router } from 'express';
import { AssignmentController } from '../controllers/assignmentController';
import { AssignmentService } from '../services/assignmentService';
import { AssignmentRepository } from '../repositories/assignmentRepository';
import { requireAuthenticated } from '../../../middlewares/auth';
import { requirePermission } from '../../../middlewares/rbac';
import { validateBody } from '../../../middlewares/validation';
import { CreateAssignmentSchema, UpdateAssignmentSchema } from '../validators/assignmentValidator';

const router = Router();
const assignmentRepository = new AssignmentRepository();
const assignmentService = new AssignmentService(assignmentRepository);
const assignmentController = new AssignmentController(assignmentService);

// Assignment routes
router.get('/', requireAuthenticated, (req, res, next) => assignmentController.listAssignments(req, res, next));
router.get('/:id', requireAuthenticated, (req, res, next) => assignmentController.getAssignmentById(req, res, next));
// Instructors are limited to their assigned cohorts — ownership asserted in the controller.
router.post('/', requireAuthenticated, requirePermission('assignments', 'create'), validateBody(CreateAssignmentSchema), (req, res, next) => assignmentController.createAssignment(req, res, next));
router.put('/:id', requireAuthenticated, requirePermission('assignments', 'update'), validateBody(UpdateAssignmentSchema), (req, res, next) => assignmentController.updateAssignment(req, res, next));
router.delete('/:id', requireAuthenticated, requirePermission('assignments', 'delete'), (req, res, next) => assignmentController.deleteAssignment(req, res, next));

export default router;
