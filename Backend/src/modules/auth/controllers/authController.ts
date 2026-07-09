import { Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { AuthenticatedRequest } from '../../../middlewares/auth';
import { AppError } from '../../../middlewares/errorHandler';


export class AuthController {
  constructor(private authService: AuthService) {}

  async signup(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const { name, email, password, role } = req.body;
    try {
      const result = await this.authService.signup({ name, email, password, role });
      res.status(201).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const { email, password } = req.body;
    try {
      const result = await this.authService.login({ email, password });
      res.json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    if (!req.user) {
      return next(new AppError('Not authenticated', 401));
    }
    res.json({
      status: 'success',
      data: {
        user: req.user
      }
    });
  }

  async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    if (!req.user) {
      return next(new AppError('Not authenticated', 401));
    }
    const { name, avatar } = req.body;
    try {
      const updatedUser = await this.authService.updateProfile(req.user.id, { name, avatar });
      res.json({
        status: 'success',
        data: {
          user: updatedUser
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
