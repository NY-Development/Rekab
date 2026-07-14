import { Response, NextFunction } from 'express';
import { AdminService } from '../services/adminService';
import { AuthenticatedRequest } from '../../../middlewares/auth';
import { AppError } from '../../../middlewares/errorHandler';
import { normalizeRole } from '../../../configs/permissions';
import { UserFilterSchema, AdminCreateUserSchema, AdminUpdateUserSchema } from '../validators/adminValidator';

export class AdminController {
  constructor(private adminService: AdminService) {}

  async listUsers(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await UserFilterSchema.parseAsync(req.query);
      const result = await this.adminService.listUsers(validated);
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

  async getUserById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await this.adminService.getUserById(req.params.id);
      res.status(200).json({ status: 'success', data: user });
    } catch (error) {
      next(error);
    }
  }

  async createUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await AdminCreateUserSchema.parseAsync(req.body);
      // Only super admins may mint admin/super-admin accounts.
      if (
        (validated.role === 'SUPER_ADMIN' || validated.role === 'ADMIN') &&
        normalizeRole(req.user!.role) !== 'SUPER_ADMIN'
      ) {
        throw new AppError('Only a super admin can create administrator accounts.', 403);
      }
      const user = await this.adminService.createUser(validated);
      res.status(201).json({ status: 'success', data: user });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await AdminUpdateUserSchema.parseAsync(req.body);
      // Role management is a SUPER_ADMIN-only capability (permission matrix: roles).
      if (validated.role !== undefined && normalizeRole(req.user!.role) !== 'SUPER_ADMIN') {
        throw new AppError('Only a super admin can change user roles.', 403);
      }
      const target = await this.adminService.getUserById(req.params.id);
      if (normalizeRole(target.role) === 'SUPER_ADMIN' && normalizeRole(req.user!.role) !== 'SUPER_ADMIN') {
        throw new AppError('Only a super admin can modify a super admin account.', 403);
      }
      const user = await this.adminService.updateUser(req.params.id, validated);
      res.status(200).json({ status: 'success', data: user });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const target = await this.adminService.getUserById(req.params.id);
      if (normalizeRole(target.role) === 'SUPER_ADMIN' && normalizeRole(req.user!.role) !== 'SUPER_ADMIN') {
        throw new AppError('Admins cannot delete super admin accounts.', 403);
      }
      await this.adminService.deleteUser(req.params.id);
      res.status(200).json({ status: 'success', message: 'User deleted successfully' });
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
