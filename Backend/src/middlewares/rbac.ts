import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import { AppError } from './errorHandler';
import { can, type Action, type Resource } from '../configs/permissions';

/**
 * Route middleware that consults the central permission matrix instead of a
 * hardcoded role list. Must run AFTER requireAuthenticated.
 *
 * This only answers "may this role perform this action at all?" — ownership
 * ('assigned'/'own' scopes) is enforced afterwards in controllers/services
 * via accessControl.service assertions, which have access to the record.
 */
export function requirePermission(resource: Resource, action: Action) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Not authenticated.', 401));
    }
    const scope = can(req.user.role, resource, action);
    if (scope === 'none') {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    next();
  };
}
