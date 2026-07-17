import { Router, Response, NextFunction } from 'express';
import { ResourceController } from '../controllers/resourceController';
import { ResourceService } from '../services/resourceService';
import { ResourceRepository } from '../repositories/resourceRepository';
import { requireAuthenticated, authorize, AuthenticatedRequest } from '../../../middlewares/auth';
import { validateBody } from '../../../middlewares/validation';
import { CreateResourceSchema, UpdateResourceSchema } from '../validators/resourceValidator';
import { uploadFileToCloudinary, UploadedFileRequest } from '../../../middlewares/uploadMiddleware';

const router = Router();
const resourceRepository = new ResourceRepository();
const resourceService = new ResourceService(resourceRepository);
const resourceController = new ResourceController(resourceService);

// Helper middleware to inject the uploaded Cloudinary file URL into req.body.url
const injectFileUrl = (req: UploadedFileRequest, res: Response, next: NextFunction) => {
  if (req.fileUrl) {
    req.body.url = req.fileUrl;
  }
  next();
};

// Resource routes
router.get('/', requireAuthenticated, (req: AuthenticatedRequest, res: Response, next: NextFunction) => resourceController.listResources(req, res, next));
router.get('/:id', requireAuthenticated, (req: AuthenticatedRequest, res: Response, next: NextFunction) => resourceController.getResourceById(req, res, next));

router.post(
  '/',
  requireAuthenticated,
  authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'),
  uploadFileToCloudinary('file', 'nydl/resources'),
  injectFileUrl as any,
  validateBody(CreateResourceSchema),
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => resourceController.createResource(req, res, next)
);

router.put(
  '/:id',
  requireAuthenticated,
  authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'),
  uploadFileToCloudinary('file', 'nydl/resources'),
  injectFileUrl as any,
  validateBody(UpdateResourceSchema),
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => resourceController.updateResource(req, res, next)
);

router.delete('/:id', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'), (req: AuthenticatedRequest, res: Response, next: NextFunction) => resourceController.deleteResource(req, res, next));

export default router;
