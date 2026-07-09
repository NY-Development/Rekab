import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth';
import { SessionService } from '../services/sessionService';
import { CreateSessionSchema, UpdateSessionSchema, SessionFilterSchema } from '../validators/sessionValidator';

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
      const validated = await SessionFilterSchema.parseAsync(req.query);
      const result = await this.sessionService.listSessions(validated);
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

  async createSession(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await CreateSessionSchema.parseAsync(req.body);
      const session = await this.sessionService.createSession(validated);
      res.status(251).json({ status: 'success', data: session });
    } catch (error) {
      next(error);
    }
  }

  async updateSession(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await UpdateSessionSchema.parseAsync(req.body);
      const session = await this.sessionService.updateSession(req.params.id, validated);
      res.status(200).json({ status: 'success', data: session });
    } catch (error) {
      next(error);
    }
  }

  async deleteSession(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.sessionService.deleteSession(req.params.id);
      res.status(200).json({ status: 'success', message: 'Session deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
