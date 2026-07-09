import { Response, NextFunction } from 'express';
import { SubmissionService } from '../services/submissionService';
import { AuthenticatedRequest } from '../../../middlewares/auth';

export class SubmissionController {
  constructor(private submissionService: SubmissionService) {}

  async submitAssignment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const { assignmentId, cohortId, repoUrl, notes } = req.body;
    try {
      const submission = await this.submissionService.submitAssignment(
        req.user!.id,
        req.user!.name,
        { assignmentId, cohortId, repoUrl, notes }
      );
      res.status(201).json({
        status: 'success',
        data: { submission }
      });
    } catch (error) {
      next(error);
    }
  }

  async listSubmissions(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const { cohortId, studentId, assignmentId } = req.query;
    try {
      const submissions = await this.submissionService.listSubmissions({
        cohortId: cohortId ? String(cohortId) : undefined,
        studentId: studentId ? String(studentId) : undefined,
        assignmentId: assignmentId ? String(assignmentId) : undefined
      });
      res.json({
        status: 'success',
        data: { submissions }
      });
    } catch (error) {
      next(error);
    }
  }

  async gradeSubmission(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    const { points, feedback } = req.body;
    try {
      const submission = await this.submissionService.gradeSubmission(
        req.user!.id,
        req.user!.name,
        id,
        { points, feedback }
      );
      res.json({
        status: 'success',
        data: { submission }
      });
    } catch (error) {
      next(error);
    }
  }
}
