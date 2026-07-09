import { StudentHealthRepository } from '../repositories/studentHealthRepository';
import { AttendanceRepository } from '../../attendance/repositories/attendanceRepository';
import { AssignmentRepository } from '../../assignments/repositories/assignmentRepository';
import { SubmissionRepository } from '../../submissions/repositories/submissionRepository';
import { EnrollmentRepository } from '../../enrollments/repositories/enrollmentRepository';
import { UpdateStudentHealthDto } from '../dtos/healthScoreDto';
import { StudentHealth } from '../../../types';
import { AppError } from '../../../middlewares/errorHandler';

export class HealthScoreService {
  constructor(
    private studentHealthRepository: StudentHealthRepository,
    private attendanceRepository: AttendanceRepository,
    private assignmentRepository: AssignmentRepository,
    private submissionRepository: SubmissionRepository,
    private enrollmentRepository: EnrollmentRepository
  ) {}

  async getHealthById(id: string): Promise<StudentHealth> {
    const health = await this.studentHealthRepository.findById(id);
    if (!health) {
      throw new AppError('Student health record not found', 404);
    }
    return health;
  }

  async getStudentHealth(studentId: string, enrollmentId: string): Promise<StudentHealth> {
    const health = await this.studentHealthRepository.findByStudentAndEnrollment(studentId, enrollmentId);
    if (!health) {
      // Auto-calculate on demand if not found
      return this.recalculateScore(studentId, enrollmentId);
    }
    return health;
  }

  async recalculateScore(studentId: string, enrollmentId: string): Promise<StudentHealth> {
    const enrollment = await this.enrollmentRepository.findById(enrollmentId);
    if (!enrollment) {
      throw new AppError('Enrollment not found', 404);
    }

    // 1. Calculate Attendance Score
    const attendanceLogs = await this.attendanceRepository.findByStudentId(studentId);
    const cohortAttendance = attendanceLogs.filter(a => a.enrollmentId.toString() === enrollmentId);
    
    let attendanceScore = 100;
    if (cohortAttendance.length > 0) {
      const sum = cohortAttendance.reduce((acc, curr) => {
        if (curr.status === 'PRESENT') return acc + 100;
        if (curr.status === 'LATE') return acc + 75;
        return acc; // ABSENT is 0
      }, 0);
      attendanceScore = Math.round(sum / cohortAttendance.length);
    }

    // 2. Calculate Assignment Score
    const submissions = await this.submissionRepository.findByStudent(studentId);
    const cohortSubmissions = submissions.filter(s => s.cohortId === enrollment.cohortId.toString());
    
    let assignmentScore = 100;
    if (cohortSubmissions.length > 0) {
      let scoredSum = 0;
      let gradedCount = 0;
      for (const sub of cohortSubmissions) {
        if (sub.status.toLowerCase() === 'graded' && typeof sub.points === 'number') {
          // Find the assignment to get max points
          const assignment = await this.assignmentRepository.findById(sub.assignmentId.toString());
          const maxPoints = assignment?.maxPoints || assignment?.maxScore || 100;
          scoredSum += (sub.points / maxPoints) * 100;
          gradedCount++;
        }
      }
      if (gradedCount > 0) {
        assignmentScore = Math.round(scoredSum / gradedCount);
      }
    }

    // Preserve previous scores for manual entries (participation/engagement) if exist
    const existing = await this.studentHealthRepository.findByStudentAndEnrollment(studentId, enrollmentId);
    const participationScore = existing?.participationScore ?? 100;
    const engagementScore = existing?.engagementScore ?? 100;

    // 3. Compute Overall Score
    const overallScore = Math.round((attendanceScore + assignmentScore + participationScore + engagementScore) / 4);

    // 4. Compute Risk Level
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (overallScore < 55) {
      riskLevel = 'HIGH';
    } else if (overallScore < 80) {
      riskLevel = 'MEDIUM';
    }

    const payload = {
      studentId,
      enrollmentId,
      attendanceScore,
      assignmentScore,
      participationScore,
      engagementScore,
      overallScore,
      riskLevel,
    };

    return this.studentHealthRepository.upsert(payload);
  }

  async updateManualScores(studentId: string, enrollmentId: string, data: UpdateStudentHealthDto): Promise<StudentHealth> {
    const existing = await this.studentHealthRepository.findByStudentAndEnrollment(studentId, enrollmentId);
    
    const attendanceScore = data.attendanceScore ?? existing?.attendanceScore ?? 100;
    const assignmentScore = data.assignmentScore ?? existing?.assignmentScore ?? 100;
    const participationScore = data.participationScore ?? existing?.participationScore ?? 100;
    const engagementScore = data.engagementScore ?? existing?.engagementScore ?? 100;

    const overallScore = Math.round((attendanceScore + assignmentScore + participationScore + engagementScore) / 4);

    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (overallScore < 55) {
      riskLevel = 'HIGH';
    } else if (overallScore < 80) {
      riskLevel = 'MEDIUM';
    }

    const payload = {
      studentId,
      enrollmentId,
      attendanceScore,
      assignmentScore,
      participationScore,
      engagementScore,
      overallScore,
      riskLevel,
    };

    return this.studentHealthRepository.upsert(payload);
  }

  async listHealthRecords(filters: {
    page: number;
    limit: number;
    studentId?: string;
    enrollmentId?: string;
    riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<{ docs: StudentHealth[]; total: number }> {
    return this.studentHealthRepository.findPaginated(filters);
  }
}
