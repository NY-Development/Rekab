import { AttendanceRepository } from '../repositories/attendanceRepository';
import { SaveAttendanceDto, BulkAttendanceDto } from '../dtos/attendanceDto';
import { Attendance } from '../../../types';
import { AppError } from '../../../middlewares/errorHandler';

export class AttendanceService {
  constructor(private attendanceRepository: AttendanceRepository) {}

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
