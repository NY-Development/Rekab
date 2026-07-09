import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth';
import { CertificateService } from '../services/certificateService';
import { IssueCertificateSchema, CertificateFilterSchema } from '../validators/certificateValidator';

export class CertificateController {
  constructor(private certificateService: CertificateService) {}

  async getCertificateById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const cert = await this.certificateService.getCertificateById(req.params.id);
      res.status(200).json({ status: 'success', data: cert });
    } catch (error) {
      next(error);
    }
  }

  async verifyCertificate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { certificateNumber } = req.params;
      if (!certificateNumber) {
        res.status(400).json({ status: 'error', message: 'Certificate number is required' });
        return;
      }
      const cert = await this.certificateService.verifyCertificate(certificateNumber);
      res.status(200).json({ status: 'success', data: cert });
    } catch (error) {
      next(error);
    }
  }

  async getMyCertificates(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }
      const certs = await this.certificateService.getStudentCertificates(req.user.id);
      res.status(200).json({ status: 'success', data: certs });
    } catch (error) {
      next(error);
    }
  }

  async listCertificates(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await CertificateFilterSchema.parseAsync(req.query);
      const result = await this.certificateService.listCertificates(validated);
      res.status(200).json({
        status: 'success',
        data: result.docs,
        pagination: {
          page: validated.page,
          limit: validated.limit,
          total: result.total,
          pages: Math.ceil(result.total / validated.limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async issueCertificate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await IssueCertificateSchema.parseAsync(req.body);
      const cert = await this.certificateService.issueCertificate(validated);
      res.status(251).json({ status: 'success', data: cert });
    } catch (error) {
      next(error);
    }
  }

  async revokeCertificate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.certificateService.revokeCertificate(req.params.id);
      res.status(200).json({ status: 'success', message: 'Certificate revoked successfully' });
    } catch (error) {
      next(error);
    }
  }
}
