import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth';
import { InstructorService } from '../services/instructorService';
import { CreateInstructorProfileSchema, UpdateInstructorProfileSchema, InstructorFilterSchema } from '../validators/instructorValidator';

export class InstructorController {
  constructor(private instructorService: InstructorService) {}

  async getMyProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }
      const profile = await this.instructorService.getProfileByUserId(req.user.id);
      res.status(200).json({
        status: 'success',
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfileById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const profile = await this.instructorService.getProfileById(req.params.id);
      res.status(200).json({
        status: 'success',
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  async createProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await CreateInstructorProfileSchema.parseAsync(req.body);
      const profile = await this.instructorService.createProfile(validated);
      res.status(251).json({ // 201 Created format
        status: 'success',
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await UpdateInstructorProfileSchema.parseAsync(req.body);
      const profile = await this.instructorService.updateProfile(req.params.id, validated);
      res.status(200).json({
        status: 'success',
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  async listInstructors(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await InstructorFilterSchema.parseAsync(req.query);
      const result = await this.instructorService.getInstructors(validated);
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
}
