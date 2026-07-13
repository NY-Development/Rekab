import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../modules/users/models/User';
import { User, UserRole } from '../types';
import { AppError } from './errorHandler';

const JWT_SECRET = process.env.JWT_SECRET || 'nydev-learning-master-secret-key-2026';

export interface AuthenticatedRequest extends Request {
  user?: User;
  params: Record<string, string>;
}

/**
 * Middleware to verify JWT and attach user to request.
 * Used as `requireAuthenticated` in existing routes.
 */
export async function requireAuthenticated(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Not authenticated. Please provide a valid token.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const userDoc = await (UserModel as any).findById(decoded.userId);
    if (!userDoc) {
      throw new AppError('User belonging to this token no longer exists.', 401);
    }

    const user = userDoc.toJSON() as User;
    delete user.passwordHash;

    if (user.isBlocked) {
      throw new AppError('Your account has been blocked. Contact support.', 403);
    }

    if (!user.isActive) {
      throw new AppError('Your account is deactivated.', 403);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else if (error instanceof jwt.TokenExpiredError) {
      // Must be checked before JsonWebTokenError: TokenExpiredError is a subclass of it,
      // so checking the parent class first would always shadow this branch.
      next(new AppError('Token expired. Please log in again.', 401, true, 'TOKEN_EXPIRED'));
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid token. Please log in again.', 401));
    } else {
      next(error);
    }
  }
}

/** Alias for backwards compatibility */
export const authenticate = requireAuthenticated;

/**
 * Authorization middleware factory.
 * Restricts access to specific roles.
 * Must be used AFTER requireAuthenticated.
 */
export function authorize(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Not authenticated.', 401));
    }

    const userRole = req.user.role.toUpperCase();
    const normalizedAllowed = allowedRoles.map((r) => r.toUpperCase());

    if (!normalizedAllowed.includes(userRole)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      );
    }

    next();
  };
}


export const requireAdmin = authorize('ADMIN', 'SUPER_ADMIN');
export const requireInstructor = authorize('INSTRUCTOR');