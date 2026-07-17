import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth';
import { EnrollmentService } from '../services/enrollmentService';
import {
  CreateEnrollmentSchema,
  UpdateEnrollmentSchema,
  EnrollmentFilterSchema,
  ReviewActionSchema,
  RejectActionSchema,
} from '../validators/enrollmentValidator';

export class EnrollmentController {
  constructor(private enrollmentService: EnrollmentService) {}

  async getEnrollmentById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const enrollment = await this.enrollmentService.getEnrollmentById(req.params.id);
      res.status(200).json({ status: 'success', data: enrollment });
    } catch (error) {
      next(error);
    }
  }

  async getMyEnrollments(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }
      const list = await this.enrollmentService.getStudentEnrollments(req.user.id);
      res.status(200).json({ status: 'success', data: list });
    } catch (error) {
      next(error);
    }
  }

  async listEnrollments(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await EnrollmentFilterSchema.parseAsync(req.query);
      const result = await this.enrollmentService.listEnrollments(validated);
      res.status(200).json({
        status: 'success',
        data: {
          docs: result.docs,
          total: result.total,
          page: validated.page,
          limit: validated.limit,
          totalPages: Math.ceil(result.total / validated.limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async apply(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }
      // Override studentId to current user for non-admins
      const bodyData = {
        ...req.body,
        studentId: req.user.role === 'ADMIN' || req.user.role === 'SUPER_ADMIN' ? (req.body.studentId || req.user.id) : req.user.id
      };

      const validated = await CreateEnrollmentSchema.parseAsync(bodyData);
      const enrollment = await this.enrollmentService.apply(validated);
      res.status(201).json({ status: 'success', data: enrollment });
    } catch (error) {
      next(error);
    }
  }

  async updateEnrollment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await UpdateEnrollmentSchema.parseAsync(req.body);
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const enrollment = await this.enrollmentService.updateEnrollment(id, validated as any);
      res.status(200).json({ status: 'success', data: enrollment });
    } catch (error) {
      next(error);
    }
  }

  async approveRegistration(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }
      const validated = await ReviewActionSchema.parseAsync(req.body || {});
      const enrollment = await this.enrollmentService.approve(req.params.id, req.user.id, req.user.name, validated.notes);
      res.status(200).json({ status: 'success', data: enrollment });
    } catch (error) {
      next(error);
    }
  }

  async rejectRegistration(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }
      const validated = await RejectActionSchema.parseAsync(req.body);
      const enrollment = await this.enrollmentService.reject(req.params.id, req.user.id, req.user.name, validated.reason, validated.notes);
      res.status(200).json({ status: 'success', data: enrollment });
    } catch (error) {
      next(error);
    }
  }

  async grantAccess(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }
      const enrollment = await this.enrollmentService.grantAccess(req.params.id, req.user.id, req.user.name);
      res.status(200).json({ status: 'success', data: enrollment });
    } catch (error) {
      next(error);
    }
  }

  async suspendAccess(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }
      const validated = await ReviewActionSchema.parseAsync(req.body || {});
      const enrollment = await this.enrollmentService.suspend(req.params.id, req.user.id, req.user.name, validated.notes);
      res.status(200).json({ status: 'success', data: enrollment });
    } catch (error) {
      next(error);
    }
  }

  async deleteEnrollment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.enrollmentService.deleteEnrollment(req.params.id);
      res.status(200).json({ status: 'success', message: 'Enrollment deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
