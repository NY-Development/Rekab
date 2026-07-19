import { AttendanceRepository } from '../repositories/attendanceRepository';
import { SessionRepository } from '../../sessions/repositories/sessionRepository';
import { EnrollmentRepository } from '../../enrollments/repositories/enrollmentRepository';
import { SaveAttendanceDto, BulkAttendanceDto } from '../dtos/attendanceDto';
import { Attendance } from '../../../types';
import { AppError } from '../../../middlewares/errorHandler';
import { DBStore } from '../../../services/dbStore';
import { refId } from '../../../services/accessControl.service';

export interface AttendanceImportRow {
  email?: string;
  name?: string;
  durationSeconds: number;
}

/** Presence thresholds: ≥80% present, >20% partial, else absent. */
function computePresence(durationSeconds: number, sessionSeconds: number): { status: string; ratio: number } {
  if (!sessionSeconds || sessionSeconds <= 0) return { status: 'PRESENT', ratio: 1 };
  const ratio = Math.min(durationSeconds / sessionSeconds, 1);
  const status = ratio >= 0.8 ? 'PRESENT' : ratio > 0.2 ? 'PARTIAL' : 'ABSENT';
  return { status, ratio: Math.round(ratio * 100) / 100 };
}

export class AttendanceService {
  constructor(
    private attendanceRepository: AttendanceRepository,
    private sessionRepository?: SessionRepository,
    private enrollmentRepository?: EnrollmentRepository
  ) {}

  private async resolveEnrollmentId(studentId: string, courseId?: string): Promise<string | undefined> {
    if (!this.enrollmentRepository || !courseId) return undefined;
    const enr = await this.enrollmentRepository.findByStudentAndCourse(studentId, courseId).catch(() => null);
    return enr?.id;
  }

  /**
   * Records a student clicking the session join link. This is the lightweight
   * "they showed up" signal; a later report import (source IMPORT/GOOGLE) with
   * exact duration takes precedence and is never downgraded by a click.
   */
  async recordJoin(studentId: string, sessionId: string): Promise<Attendance> {
    const session = this.sessionRepository ? await this.sessionRepository.findById(sessionId) : null;
    if (!session) throw new AppError('Session not found', 404);

    const existing = await this.attendanceRepository.findBySessionAndStudent(sessionId, studentId);
    if (existing && (existing.source === 'IMPORT' || existing.source === 'GOOGLE')) {
      return existing; // don't overwrite an authoritative report with a click
    }

    const enrollmentId = await this.resolveEnrollmentId(studentId, refId(session.courseId));
    return this.attendanceRepository.createOrUpdate({
      studentId,
      sessionId,
      enrollmentId,
      status: 'PRESENT',
      source: 'CLICK',
      checkInTime: new Date().toISOString(),
      markedBy: studentId,
    } as any);
  }

  /**
   * Merges an uploaded attendance report (rows of email/name + durationSeconds)
   * into attendance records, computing present/partial/absent from each
   * student's presence ratio against the session length.
   */
  async importAttendance(
    markerId: string,
    sessionId: string,
    rows: AttendanceImportRow[]
  ): Promise<{ imported: number; unmatched: string[]; records: Attendance[] }> {
    const session = this.sessionRepository ? await this.sessionRepository.findById(sessionId) : null;
    if (!session) throw new AppError('Session not found', 404);
    const sessionSeconds = (Number(session.duration) || 0) * 60;
    const courseId = refId(session.courseId);

    const users = await DBStore.getUsers();
    const byEmail = new Map(users.map((u) => [u.email?.toLowerCase(), u]));
    const byName = new Map(users.map((u) => [u.name?.toLowerCase().trim(), u]));

    const records: Attendance[] = [];
    const unmatched: string[] = [];

    for (const row of rows) {
      const user = (row.email && byEmail.get(row.email.toLowerCase())) || (row.name && byName.get(row.name.toLowerCase().trim()));
      if (!user) {
        unmatched.push(row.email || row.name || 'unknown');
        continue;
      }
      const { status, ratio } = computePresence(row.durationSeconds, sessionSeconds);
      const enrollmentId = await this.resolveEnrollmentId(user.id, courseId);
      const saved = await this.attendanceRepository.createOrUpdate({
        studentId: user.id,
        sessionId,
        enrollmentId,
        status,
        durationSeconds: row.durationSeconds,
        presenceRatio: ratio,
        source: 'IMPORT',
        checkInTime: new Date().toISOString(),
        markedBy: markerId,
      } as any);
      records.push(saved);
    }

    return { imported: records.length, unmatched, records };
  }

  async getAttendanceById(id: string): Promise<Attendance> {
    const record = await this.attendanceRepository.findById(id);
    if (!record) {
      throw new AppError('Attendance record not found', 404);
    }
    return record;
  }

  async getSessionAttendance(sessionId: string): Promise<Attendance[]> {
    return this.attendanceRepository.findBySessionId(sessionId);
  }

  async getStudentAttendance(studentId: string): Promise<Attendance[]> {
    return this.attendanceRepository.findByStudentId(studentId);
  }

  async markAttendance(markerId: string, data: SaveAttendanceDto): Promise<Attendance> {
    const payload = {
      ...data,
      markedBy: markerId,
    };
    return this.attendanceRepository.createOrUpdate(payload);
  }

  async bulkMarkAttendance(markerId: string, data: BulkAttendanceDto): Promise<Attendance[]> {
    const results: Attendance[] = [];
    for (const record of data.records) {
      const payload = {
        sessionId: data.sessionId,
        studentId: record.studentId,
        enrollmentId: record.enrollmentId,
        status: record.status,
        remarks: record.remarks,
        checkInTime: record.checkInTime || (record.status !== 'ABSENT' ? new Date().toISOString() : undefined),
        markedBy: markerId,
      };
      const saved = await this.attendanceRepository.createOrUpdate(payload);
      results.push(saved);
    }
    return results;
  }

  async deleteAttendance(id: string): Promise<void> {
    const record = await this.attendanceRepository.findById(id);
    if (!record) {
      throw new AppError('Attendance record not found', 404);
    }
    const deleted = await this.attendanceRepository.delete(id);
    if (!deleted) {
      throw new AppError('Failed to delete attendance record', 500);
    }
  }

  async listAttendance(filters: {
    page: number;
    limit: number;
    studentId?: string;
    sessionId?: string;
    enrollmentId?: string;
    status?: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<{ docs: Attendance[]; total: number }> {
    return this.attendanceRepository.findPaginated(filters);
  }
}
