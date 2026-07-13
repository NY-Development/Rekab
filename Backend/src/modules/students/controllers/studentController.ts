import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth';
import { StudentService } from '../services/studentService';
import { CreateStudentProfileSchema, UpdateStudentProfileSchema, StudentFilterSchema } from '../validators/studentValidator';

export class StudentController {
  constructor(private studentService: StudentService) {}

  async getMyProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }
      const profile = await this.studentService.getProfileByUserId(req.user.id);
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
      const profile = await this.studentService.getProfileById(req.params.id);
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
      const validated = await CreateStudentProfileSchema.parseAsync(req.body);
      const profile = await this.studentService.createProfile(validated);
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
      const validated = await UpdateStudentProfileSchema.parseAsync(req.body);
      const profile = await this.studentService.updateProfile(req.params.id, validated);
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
      await this.studentService.deleteProfile(req.params.id);
      res.status(200).json({ status: 'success', message: 'Student profile deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async listStudents(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await StudentFilterSchema.parseAsync(req.query);
      const result = await this.studentService.getStudents(validated);
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
