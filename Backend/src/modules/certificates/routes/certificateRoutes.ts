import { Router } from 'express';
import { CertificateController } from '../controllers/certificateController';
import { CertificateService } from '../services/certificateService';
import { CertificateRepository } from '../repositories/certificateRepository';
import { requireAuthenticated, authorize } from '../../../middlewares/auth';
import { validateBody } from '../../../middlewares/validation';
import { IssueCertificateSchema } from '../validators/certificateValidator';

const router = Router();
const certificateRepository = new CertificateRepository();
const certificateService = new CertificateService(certificateRepository);
const certificateController = new CertificateController(certificateService);

// Public verification
router.get('/verify/:certificateNumber', (req: any, res: any, next: any) => certificateController.verifyCertificate(req, res, next));

// Authenticated routes
router.get('/me', requireAuthenticated, (req, res, next) => certificateController.getMyCertificates(req, res, next));
router.get('/', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN'), (req, res, next) => certificateController.listCertificates(req, res, next));
router.get('/:id', requireAuthenticated, (req, res, next) => certificateController.getCertificateById(req, res, next));
router.post('/', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN'), validateBody(IssueCertificateSchema), (req, res, next) => certificateController.issueCertificate(req, res, next));
router.delete('/:id', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN'), (req, res, next) => certificateController.revokeCertificate(req, res, next));

export default router;
