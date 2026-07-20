import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../modules/users/models/User';
import { User, UserRole } from '../types';
import { AppError } from './errorHandler';
import InstructorProfileModel from '../modules/instructors/models/InstructorProfile';
import { CurriculumModel } from '../modules/curriculum/models/Curriculum';
import { ModuleModel } from '../modules/curriculum/models/Module';
import { LessonModel } from '../modules/curriculum/models/Lesson';

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
 * Attaches the user when a valid token is present, but never rejects — for
 * public endpoints (e.g. the contact form) that want to enrich the record with
 * the submitter's identity when they happen to be signed in.
 */
export async function optionalAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      const userDoc = await (UserModel as any).findById(decoded.userId);
      if (userDoc) {
        const user = userDoc.toJSON() as User;
        delete user.passwordHash;
        req.user = user;
      }
    }
  } catch {
    // Ignore any token problems — this endpoint is public.
  }
  next();
}

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

/**
 * Guard to ensure INSTRUCTORS can only access/modify data belonging to their assigned courses.
 * If user is ADMIN or SUPER_ADMIN, they bypass these checks.
 */
export async function instructorCourseGuard(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = req.user;
    if (!user) {
      throw new AppError('Not authenticated.', 401);
    }

    const role = user.role.toUpperCase();

    // Admin/Super Admin bypass
    if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
      return next();
    }

    // ONLY instructors are checked. If student/visitor somehow triggers this, throw forbidden.
    if (role !== 'INSTRUCTOR') {
      throw new AppError('Forbidden. You do not have permission to perform this action.', 403);
    }

    // Resolve courseId
    let courseId: string | undefined = req.body.courseId || req.query.courseId;

    if (!courseId) {
      const id = req.params.id;
      const path = req.path.toLowerCase();

      if (id) {
        if (path.includes('/modules')) {
          // Module actions
          const moduleDoc = await ModuleModel.findById(id);
          if (moduleDoc) {
            courseId = moduleDoc.courseId?.toString();
          }
        } else if (path.includes('/lessons')) {
          // Lesson actions
          const lessonDoc = await LessonModel.findById(id);
          if (lessonDoc) {
            const moduleDoc = await ModuleModel.findById(lessonDoc.moduleId);
            if (moduleDoc) {
              courseId = moduleDoc.courseId?.toString();
            }
          }
        } else {
          // Curriculum actions
          const curriculumDoc = await CurriculumModel.findById(id);
          if (curriculumDoc) {
            courseId = curriculumDoc.courseId?.toString();
          }
        }
      } else {
        // No params.id. Check if we have moduleId in body
        if (req.body.moduleId) {
          const moduleDoc = await ModuleModel.findById(req.body.moduleId);
          if (moduleDoc) {
            courseId = moduleDoc.courseId?.toString();
          }
        }
      }
    }

    if (!courseId) {
      // If we couldn't resolve the courseId, it might be a general index request.
      // Usually, index requests are GETs and don't mutate, but if it is a mutation/post, throw error.
      if (req.method !== 'GET') {
        throw new AppError('Could not resolve course scope for this request.', 400);
      }
      return next();
    }

    // Check instructor assigned courses
    const profile = await InstructorProfileModel.findOne({ userId: user.id || (user as any)._id });
    if (!profile) {
      throw new AppError('Instructor profile not found.', 403);
    }

    const assignedCourses = (profile.assignedCourses || []).map((c: any) => c.toString());
    if (!assignedCourses.includes(courseId)) {
      throw new AppError('You are not assigned to manage this course.', 403);
    }

    next();
  } catch (error) {
    next(error);
  }
}