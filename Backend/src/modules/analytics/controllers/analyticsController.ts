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
      res.status(201).json({ status: 'success', data: activity });
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

  async getActivityLogs(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await ActivityLogFilterSchema.parseAsync(req.query);
      const result = await this.analyticsService.getActivityLogs(validated);
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

  async getSummary(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const summary = await this.analyticsService.getSummary();
      res.status(200).json({ status: 'success', data: summary });
    } catch (error) {
      next(error);
    }
  }

  async getEnrollmentTrends(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const months = Math.min(Math.max(parseInt(String(req.query.months || '6'), 10) || 6, 1), 24);
      const trends = await this.analyticsService.getEnrollmentTrends(months);
      res.status(200).json({ status: 'success', data: trends });
    } catch (error) {
      next(error);
    }
  }

  async getRevenueTrends(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const months = Math.min(Math.max(parseInt(String(req.query.months || '6'), 10) || 6, 1), 24);
      const trends = await this.analyticsService.getRevenueTrends(months);
      res.status(200).json({ status: 'success', data: trends });
    } catch (error) {
      next(error);
    }
  }
}
