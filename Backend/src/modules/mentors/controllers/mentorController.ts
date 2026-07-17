import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth';
import { MentorService } from '../services/mentorService';
import { CreateMentorProfileSchema, UpdateMentorProfileSchema, MentorFilterSchema } from '../validators/mentorValidator';

export class MentorController {
  constructor(private mentorService: MentorService) {}

  async getMyProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }
      const profile = await this.mentorService.getProfileByUserId(req.user.id);
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
      const profile = await this.mentorService.getProfileById(req.params.id);
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
      const validated = await CreateMentorProfileSchema.parseAsync(req.body);
      const profile = await this.mentorService.createProfile(validated);
      res.status(201).json({ // 201 Created format
        status: 'success',
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await UpdateMentorProfileSchema.parseAsync(req.body);
      const profile = await this.mentorService.updateProfile(req.params.id, validated);
      res.status(200).json({
        status: 'success',
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.mentorService.deleteProfile(req.params.id);
      res.status(200).json({ status: 'success', message: 'Mentor profile deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async listMentors(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await MentorFilterSchema.parseAsync(req.query);
      const result = await this.mentorService.getMentors(validated);
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
}
