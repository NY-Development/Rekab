import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth';
import { TeamService } from '../services/teamService';
import { CreateTeamSchema, UpdateTeamSchema, TeamFilterSchema } from '../validators/teamValidator';

export class TeamController {
  constructor(private teamService: TeamService) {}

  async getTeamById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const team = await this.teamService.getTeamById(req.params.id);
      res.status(200).json({ status: 'success', data: team });
    } catch (error) {
      next(error);
    }
  }

  async listTeams(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await TeamFilterSchema.parseAsync(req.query);
      const result = await this.teamService.listTeams(validated);
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

  async createTeam(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await CreateTeamSchema.parseAsync(req.body);
      const team = await this.teamService.createTeam(validated);
      res.status(251).json({ status: 'success', data: team });
    } catch (error) {
      next(error);
    }
  }

  async updateTeam(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await UpdateTeamSchema.parseAsync(req.body);
      const team = await this.teamService.updateTeam(req.params.id, validated);
      res.status(200).json({ status: 'success', data: team });
    } catch (error) {
      next(error);
    }
  }

  async deleteTeam(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.teamService.deleteTeam(req.params.id);
      res.status(200).json({ status: 'success', message: 'Team deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async addMember(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.body;
      if (!userId) {
        res.status(400).json({ status: 'error', message: 'userId is required' });
        return;
      }
      const team = await this.teamService.addMember(req.params.id, userId);
      res.status(200).json({ status: 'success', data: team });
    } catch (error) {
      next(error);
    }
  }

  async removeMember(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.body;
      if (!userId) {
        res.status(400).json({ status: 'error', message: 'userId is required' });
        return;
      }
      const team = await this.teamService.removeMember(req.params.id, userId);
      res.status(200).json({ status: 'success', data: team });
    } catch (error) {
      next(error);
    }
  }
}
