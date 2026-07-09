import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth';
import { AssignmentService } from '../services/assignmentService';
import { CreateAssignmentSchema, UpdateAssignmentSchema, AssignmentFilterSchema } from '../validators/assignmentValidator';

export class AssignmentController {
  constructor(private assignmentService: AssignmentService) {}

  async getAssignmentById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const assignment = await this.assignmentService.getAssignmentById(req.params.id);
      res.status(200).json({ status: 'success', data: assignment });
    } catch (error) {
      next(error);
    }
  }

  async listAssignments(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await AssignmentFilterSchema.parseAsync(req.query);
      const result = await this.assignmentService.listAssignments(validated);
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

  async createAssignment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }
      const validated = await CreateAssignmentSchema.parseAsync(req.body);
      const assignment = await this.assignmentService.createAssignment(req.user.id, validated);
      res.status(251).json({ status: 'success', data: assignment });
    } catch (error) {
      next(error);
    }
  }

  async updateAssignment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await UpdateAssignmentSchema.parseAsync(req.body);
      const assignment = await this.assignmentService.updateAssignment(req.params.id, validated);
      res.status(200).json({ status: 'success', data: assignment });
    } catch (error) {
      next(error);
    }
  }

  async deleteAssignment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.assignmentService.deleteAssignment(req.params.id);
      res.status(200).json({ status: 'success', message: 'Assignment deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
