import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth';
import { AttendanceService } from '../services/attendanceService';
import { SaveAttendanceSchema, BulkAttendanceSchema, AttendanceFilterSchema } from '../validators/attendanceValidator';
import { assertSessionCohortAccess } from '../../../services/accessControl.service';

export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  async getAttendanceById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const record = await this.attendanceService.getAttendanceById(req.params.id);
      res.status(200).json({ status: 'success', data: record });
    } catch (error) {
      next(error);
    }
  }

  async getSessionAttendance(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const records = await this.attendanceService.getSessionAttendance(req.params.sessionId);
      res.status(200).json({ status: 'success', data: records });
    } catch (error) {
      next(error);
    }
  }

  async getMyAttendance(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }
      const records = await this.attendanceService.getStudentAttendance(req.user.id);
      res.status(200).json({ status: 'success', data: records });
    } catch (error) {
      next(error);
    }
  }

  async listAttendance(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await AttendanceFilterSchema.parseAsync(req.query);
      const result = await this.attendanceService.listAttendance(validated);
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

  async markAttendance(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }
      const validated = await SaveAttendanceSchema.parseAsync(req.body);
      await assertSessionCohortAccess(req.user, (validated as any).sessionId);
      const record = await this.attendanceService.markAttendance(req.user.id, validated);
      res.status(201).json({ status: 'success', data: record });
    } catch (error) {
      next(error);
    }
  }

  async bulkMarkAttendance(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }
      const validated = await BulkAttendanceSchema.parseAsync(req.body);
      await assertSessionCohortAccess(req.user, (validated as any).sessionId);
      const records = await this.attendanceService.bulkMarkAttendance(req.user.id, validated);
      res.status(201).json({ status: 'success', data: records });
    } catch (error) {
      next(error);
    }
  }

  async deleteAttendance(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.attendanceService.deleteAttendance(req.params.id);
      res.status(200).json({ status: 'success', message: 'Attendance record deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
