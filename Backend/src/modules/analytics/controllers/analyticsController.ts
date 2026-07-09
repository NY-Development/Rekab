import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth';
import { AnalyticsService } from '../services/analyticsService';
import { LogStudentActivitySchema, StudentActivityFilterSchema, ActivityLogFilterSchema } from '../validators/analyticsValidator';

export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  async logStudentActivity(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }
      const validated = await LogStudentActivitySchema.parseAsync(req.body);
      const activity = await this.analyticsService.logStudentActivity(req.user.id, validated);
      res.status(251).json({ status: 'success', data: activity });
    } catch (error) {
      next(error);
    }
  }

  async getStudentActivities(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await StudentActivityFilterSchema.parseAsync(req.query);
      const result = await this.analyticsService.getStudentActivities(validated);
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

  async getActivityLogs(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await ActivityLogFilterSchema.parseAsync(req.query);
      const result = await this.analyticsService.getActivityLogs(validated);
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
