import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';

export class UserController {
  constructor(private userService: UserService) {}

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Basic placeholder controller
    res.json({ message: 'User profile route' });
  }
}
