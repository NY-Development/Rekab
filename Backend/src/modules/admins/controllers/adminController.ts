import { Response, NextFunction } from 'express';
import { AdminService } from '../services/adminService';
import { AuthenticatedRequest } from '../../../middlewares/auth';

export class AdminController {
  constructor(private adminService: AdminService) {}

  async listUsers(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await this.adminService.listUsers();
      res.json({
        status: 'success',
        data: { users }
      });
    } catch (error) {
      next(error);
    }
  }

  async getSystemLogs(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const logs = await this.adminService.getSystemLogs();
      res.json({
        status: 'success',
        data: { logs }
      });
    } catch (error) {
      next(error);
    }
  }

  async getDashboardStats(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await this.adminService.getDashboardStats();
      res.json({
        status: 'success',
        data: { stats }
      });
    } catch (error) {
      next(error);
    }
  }
}
