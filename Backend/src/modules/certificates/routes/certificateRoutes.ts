import { Router, Response, NextFunction } from 'express';
import { CertificateController } from '../controllers/certificateController';
import { CertificateService } from '../services/certificateService';
import { CertificateRepository } from '../repositories/certificateRepository';
import { CourseRepository } from '../../courses/repositories/courseRepository';
import { requireAuthenticated, authorize, AuthenticatedRequest } from '../../../middlewares/auth';
import { validateBody } from '../../../middlewares/validation';
import { IssueCertificateSchema } from '../validators/certificateValidator';
import { uploadFileToCloudinary, UploadedFileRequest } from '../../../middlewares/uploadMiddleware';

const router = Router();
const certificateRepository = new CertificateRepository();
const courseRepository = new CourseRepository();
const certificateService = new CertificateService(certificateRepository, courseRepository);
const certificateController = new CertificateController(certificateService);

const requireAdmin = authorize('ADMIN', 'SUPER_ADMIN');

// Public verification
router.get('/verify/:certificateNumber', (req: any, res: any, next: any) => certificateController.verifyCertificate(req, res, next));

// Authenticated routes
router.get('/me', requireAuthenticated, (req, res, next) => certificateController.getMyCertificates(req, res, next));
router.get('/', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN'), (req, res, next) => certificateController.listCertificates(req, res, next));
router.get('/:id', requireAuthenticated, (req, res, next) => certificateController.getCertificateById(req, res, next));
router.post('/', requireAuthenticated, requireAdmin, validateBody(IssueCertificateSchema), (req, res, next) => certificateController.issueCertificate(req, res, next));

// Admin: upload a template image/PDF → hosted URL.
router.post(
  '/template',
  requireAuthenticated,
  requireAdmin,
  uploadFileToCloudinary('file', 'nydl/certificates/templates'),
  (req: UploadedFileRequest, res: Response, next: NextFunction) => certificateController.uploadTemplate(req, res, next)
);

// Admin: generate certificates for selected students from a template.
router.post('/generate', requireAuthenticated, requireAdmin, (req: AuthenticatedRequest, res: Response, next: NextFunction) =>
  certificateController.generateCertificates(req, res, next)
);

router.delete('/:id', requireAuthenticated, requireAdmin, (req, res, next) => certificateController.revokeCertificate(req, res, next));

export default router;
