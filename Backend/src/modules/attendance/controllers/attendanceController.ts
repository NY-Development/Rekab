import { Response, NextFunction } from 'express';
import * as XLSX from 'xlsx';
import { AuthenticatedRequest } from '../../../middlewares/auth';
import { UploadedFileRequest } from '../../../middlewares/uploadMiddleware';
import { AttendanceService, AttendanceImportRow } from '../services/attendanceService';
import { SaveAttendanceSchema, BulkAttendanceSchema, AttendanceFilterSchema } from '../validators/attendanceValidator';
import { assertSessionCohortAccess } from '../../../services/accessControl.service';
import { AppError } from '../../../middlewares/errorHandler';

/** Best-effort parse of a duration cell into seconds ("45", "45 min", "1:05:00", "1h 5m"). */
function parseDurationToSeconds(raw: unknown): number {
  if (raw == null) return 0;
  if (typeof raw === 'number') return Math.round(raw * 60); // bare number = minutes
  const s = String(raw).trim().toLowerCase();
  if (!s) return 0;
  // hh:mm:ss or mm:ss
  if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(s)) {
    const parts = s.split(':').map(Number);
    return parts.length === 3 ? parts[0] * 3600 + parts[1] * 60 + parts[2] : parts[0] * 60 + parts[1];
  }
  let total = 0;
  const h = s.match(/(\d+)\s*h/);
  const m = s.match(/(\d+)\s*m/);
  const sec = s.match(/(\d+)\s*s/);
  if (h) total += Number(h[1]) * 3600;
  if (m) total += Number(m[1]) * 60;
  if (sec) total += Number(sec[1]);
  if (total > 0) return total;
  const num = parseFloat(s);
  return isNaN(num) ? 0 : Math.round(num * 60); // fallback: minutes
}

function pick(row: Record<string, any>, keys: string[]): any {
  const lowerMap = new Map(Object.keys(row).map((k) => [k.toLowerCase().trim(), k]));
  for (const key of keys) {
    const found = lowerMap.get(key);
    if (found != null && row[found] != null && row[found] !== '') return row[found];
  }
  return undefined;
}

export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  /** Student clicks the session join link — record the attendance signal. */
  async recordJoin(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }
      const sessionId = req.body?.sessionId;
      if (!sessionId) throw new AppError('sessionId is required', 400);
      const record = await this.attendanceService.recordJoin(req.user.id, sessionId);
      res.status(201).json({ status: 'success', data: record });
    } catch (error) {
      next(error);
    }
  }

  /** Instructor/admin uploads a Google Meet attendance report (CSV/XLSX). */
  async importAttendance(req: UploadedFileRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as unknown as AuthenticatedRequest;
      const sessionId = authReq.params.sessionId;
      await assertSessionCohortAccess(authReq.user!, sessionId);
      if (!req.file) throw new AppError('Upload a CSV or XLSX attendance file.', 400);

      const wb = XLSX.read(req.file.buffer, { type: 'buffer' });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { defval: '' });

      const rows: AttendanceImportRow[] = json
        .map((r) => ({
          email: (pick(r, ['email', 'email address', 'e-mail']) as string) || undefined,
          name: (pick(r, ['name', 'full name', 'participant', 'participant name']) as string) || undefined,
          durationSeconds: parseDurationToSeconds(pick(r, ['duration', 'time in call', 'duration (minutes)', 'minutes', 'length'])),
        }))
        .filter((r) => r.email || r.name);

      if (rows.length === 0) throw new AppError('No usable rows found. Expected columns like Name/Email and Duration.', 400);

      const result = await this.attendanceService.importAttendance(authReq.user!.id, sessionId, rows);
      res.status(201).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  }

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
      // Admins see any session; instructors/mentors only their assigned cohorts'.
      await assertSessionCohortAccess(req.user!, req.params.sessionId);
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
