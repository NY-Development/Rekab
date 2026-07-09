import { Response, NextFunction } from 'express';
import { CohortService } from '../services/cohortService';
import { AuthenticatedRequest } from '../../../middlewares/auth';

export class CohortController {
  constructor(private cohortService: CohortService) {}

  async listCohorts(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const { courseId, studentId } = req.query;
    try {
      const cohorts = await this.cohortService.listCohorts({
        courseId: courseId ? String(courseId) : undefined,
        studentId: studentId ? String(studentId) : undefined
      });
      res.json({
        status: 'success',
        data: { cohorts }
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
        data: { cohort }
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
        data: { cohort }
      });
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
