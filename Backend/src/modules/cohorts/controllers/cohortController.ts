import { Response, NextFunction } from 'express';
import { CohortService } from '../services/cohortService';
import { AuthenticatedRequest } from '../../../middlewares/auth';
import { CohortFilterSchema, UpdateCohortSchema } from '../validators/cohortValidator';

export class CohortController {
  constructor(private cohortService: CohortService) {}

  async listCohorts(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await CohortFilterSchema.parseAsync(req.query);
      const result = await this.cohortService.listCohorts(validated);
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

  async getCohortDetails(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    try {
      const cohort = await this.cohortService.getCohortDetails(id);
      res.json({
        status: 'success',
        data: cohort
      });
    } catch (error) {
      next(error);
    }
  }

  async createCohort(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const { courseId, name, code, startDate, endDate, maxCapacity, instructors, schedule } = req.body;
    try {
      const cohort = await this.cohortService.createCohort(
        req.user!.id,
        req.user!.name,
        {
          courseId,
          name,
          code,
          startDate,
          endDate,
          maxCapacity,
          instructors,
          schedule
        }
      );
      res.status(201).json({
        status: 'success',
        data: cohort
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCohort(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await UpdateCohortSchema.parseAsync(req.body);
      const cohort = await this.cohortService.updateCohort(req.user!.id, req.user!.name, req.params.id, validated);
      res.status(200).json({ status: 'success', data: cohort });
    } catch (error) {
      next(error);
    }
  }

  async deleteCohort(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.cohortService.deleteCohort(req.user!.id, req.user!.name, req.params.id);
      res.status(200).json({ status: 'success', message: 'Cohort deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async enrollInCohort(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const { cohortId } = req.params;
    const studentId = req.body.studentId || req.user!.id;
    try {
      const enrollment = await this.cohortService.enrollInCohort(
        req.user!.id,
        req.user!.name,
        cohortId,
        studentId
      );
      res.status(201).json({
        status: 'success',
        data: { enrollment }
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCohortStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    const { status } = req.body;
    try {
      const cohort = await this.cohortService.updateCohortStatus(
        req.user!.id,
        req.user!.name,
        id,
        status
      );
      res.json({
        status: 'success',
        data: { cohort }
      });
    } catch (error) {
      next(error);
    }
  }
}
