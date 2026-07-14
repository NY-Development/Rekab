import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth';
import { AssignmentService } from '../services/assignmentService';
import { CreateAssignmentSchema, UpdateAssignmentSchema, AssignmentFilterSchema } from '../validators/assignmentValidator';
import { getContentScope, assertCohortAccess, refId } from '../../../services/accessControl.service';
import { isAdminRole } from '../../../configs/permissions';

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
      const validated: any = await AssignmentFilterSchema.parseAsync(req.query);

      // Non-admins only see assignments for cohorts in their scope
      // (students: enrolled cohorts, instructors/mentors: assigned cohorts).
      if (req.user && !isAdminRole(req.user.role)) {
        const scope = await getContentScope(req.user);
        if (!scope || scope.cohortIds.length === 0) {
          res.status(200).json({
            status: 'success',
            data: { docs: [], total: 0, page: validated.page, limit: validated.limit, totalPages: 0 },
          });
          return;
        }
        validated.cohortIds = scope.cohortIds;
      }

      const result = await this.assignmentService.listAssignments(validated);
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

  async createAssignment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }
      const validated = await CreateAssignmentSchema.parseAsync(req.body);
      await assertCohortAccess(req.user, (validated as any).cohortId);
      const assignment = await this.assignmentService.createAssignment(req.user.id, validated);
      res.status(251).json({ status: 'success', data: assignment });
    } catch (error) {
      next(error);
    }
  }

  async updateAssignment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const existing = await this.assignmentService.getAssignmentById(req.params.id);
      await assertCohortAccess(req.user!, refId(existing.cohortId));
      const validated = await UpdateAssignmentSchema.parseAsync(req.body);
      const assignment = await this.assignmentService.updateAssignment(req.params.id, validated);
      res.status(200).json({ status: 'success', data: assignment });
    } catch (error) {
      next(error);
    }
  }

  async deleteAssignment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const existing = await this.assignmentService.getAssignmentById(req.params.id);
      await assertCohortAccess(req.user!, refId(existing.cohortId));
      await this.assignmentService.deleteAssignment(req.params.id);
      res.status(200).json({ status: 'success', message: 'Assignment deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
