import { Router } from 'express';
import { ResourceController } from '../controllers/resourceController';
import { ResourceService } from '../services/resourceService';
import { ResourceRepository } from '../repositories/resourceRepository';
import { requireAuthenticated, authorize } from '../../../middlewares/auth';
import { validateBody } from '../../../middlewares/validation';
import { CreateResourceSchema, UpdateResourceSchema } from '../validators/resourceValidator';

const router = Router();
const resourceRepository = new ResourceRepository();
const resourceService = new ResourceService(resourceRepository);
const resourceController = new ResourceController(resourceService);

// Resource routes
router.get('/', requireAuthenticated, (req, res, next) => resourceController.listResources(req, res, next));
router.get('/:id', requireAuthenticated, (req, res, next) => resourceController.getResourceById(req, res, next));
router.post('/', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'), validateBody(CreateResourceSchema), (req, res, next) => resourceController.createResource(req, res, next));
router.put('/:id', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'), validateBody(UpdateResourceSchema), (req, res, next) => resourceController.updateResource(req, res, next));
router.delete('/:id', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'), (req, res, next) => resourceController.deleteResource(req, res, next));

export default router;
