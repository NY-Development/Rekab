import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth';
import { HealthScoreService } from '../services/healthScoreService';
import { UpdateStudentHealthSchema, HealthFilterSchema } from '../validators/healthScoreValidator';

export class HealthScoreController {
  constructor(private healthScoreService: HealthScoreService) {}

  async getHealthById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const health = await this.healthScoreService.getHealthById(req.params.id);
      res.status(200).json({ status: 'success', data: health });
    } catch (error) {
      next(error);
    }
  }

  async getStudentHealth(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { studentId, enrollmentId } = req.params;
      if (!studentId || !enrollmentId) {
        res.status(400).json({ status: 'error', message: 'studentId and enrollmentId are required' });
        return;
      }
      const health = await this.healthScoreService.getStudentHealth(studentId, enrollmentId);
      res.status(200).json({ status: 'success', data: health });
    } catch (error) {
      next(error);
    }
  }

  async recalculateScore(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { studentId, enrollmentId } = req.body;
      if (!studentId || !enrollmentId) {
        res.status(400).json({ status: 'error', message: 'studentId and enrollmentId are required' });
        return;
      }
      const health = await this.healthScoreService.recalculateScore(studentId, enrollmentId);
      res.status(200).json({ status: 'success', data: health });
    } catch (error) {
      next(error);
    }
  }

  async updateManualScores(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { studentId, enrollmentId } = req.params;
      const validated = await UpdateStudentHealthSchema.parseAsync(req.body);
      const health = await this.healthScoreService.updateManualScores(studentId, enrollmentId, validated);
      res.status(200).json({ status: 'success', data: health });
    } catch (error) {
      next(error);
    }
  }

  async listHealthRecords(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await HealthFilterSchema.parseAsync(req.query);
      const result = await this.healthScoreService.listHealthRecords(validated);
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
