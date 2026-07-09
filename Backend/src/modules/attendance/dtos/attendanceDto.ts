import { Attendance, User, Session, Enrollment } from '../../../types';

export interface AttendanceDto extends Attendance {
  student?: Partial<User>;
  session?: Partial<Session>;
  enrollment?: Partial<Enrollment>;
  marker?: Partial<User>;
}

export type SaveAttendanceDto = Omit<Attendance, 'id' | 'markedBy' | 'createdAt' | 'updatedAt'>;

export type BulkAttendanceDto = {
  sessionId: string;
  records: Array<{
    studentId: string;
    enrollmentId: string;
    status: 'PRESENT' | 'LATE' | 'ABSENT';
    remarks?: string;
    checkInTime?: string;
  }>;
};
