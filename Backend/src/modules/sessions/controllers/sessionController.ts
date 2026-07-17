import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth';
import { SessionService } from '../services/sessionService';
import { CreateSessionSchema, UpdateSessionSchema, SessionFilterSchema } from '../validators/sessionValidator';
import { getContentScope, assertCohortAccess, refId } from '../../../services/accessControl.service';
import { isAdminRole } from '../../../configs/permissions';

export class SessionController {
  constructor(private sessionService: SessionService) {}

  async getSessionById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const session = await this.sessionService.getSessionById(req.params.id);
      res.status(200).json({ status: 'success', data: session });
    } catch (error) {
      next(error);
    }
  }

  async getSessions(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated: any = await SessionFilterSchema.parseAsync(req.query);

      // Non-admins only see sessions for cohorts in their scope
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

      const result = await this.sessionService.listSessions(validated);
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

  async createSession(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await CreateSessionSchema.parseAsync(req.body);
      await assertCohortAccess(req.user!, (validated as any).cohortId);
      const session = await this.sessionService.createSession(validated);
      res.status(201).json({ status: 'success', data: session });
    } catch (error) {
      next(error);
    }
  }

  async updateSession(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const existing = await this.sessionService.getSessionById(req.params.id);
      await assertCohortAccess(req.user!, refId(existing.cohortId));
      const validated = await UpdateSessionSchema.parseAsync(req.body);
      const session = await this.sessionService.updateSession(req.params.id, validated);
      res.status(200).json({ status: 'success', data: session });
    } catch (error) {
      next(error);
    }
  }

  async deleteSession(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const existing = await this.sessionService.getSessionById(req.params.id);
      await assertCohortAccess(req.user!, refId(existing.cohortId));
      await this.sessionService.deleteSession(req.params.id);
      res.status(200).json({ status: 'success', message: 'Session deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
