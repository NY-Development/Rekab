import { StudentHealth, User, Enrollment } from '../../../types';

export interface StudentHealthDto extends StudentHealth {
  student?: Partial<User>;
  enrollment?: Partial<Enrollment>;
}

export type UpdateStudentHealthDto = Partial<Pick<StudentHealth, 'participationScore' | 'engagementScore' | 'attendanceScore' | 'assignmentScore'>>;
