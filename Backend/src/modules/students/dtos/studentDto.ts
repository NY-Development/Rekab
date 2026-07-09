import { StudentProfile, User } from '../../../types';

export interface StudentProfileDto extends StudentProfile {
  user?: Partial<User>;
}

export type CreateStudentProfileDto = Omit<StudentProfile, 'id' | 'totalCourses' | 'completedCourses' | 'attendanceAverage' | 'assignmentAverage' | 'participationScore' | 'healthScore' | 'createdAt' | 'updatedAt'>;

export type UpdateStudentProfileDto = Partial<Omit<StudentProfile, 'id' | 'userId' | 'studentCode' | 'createdAt' | 'updatedAt'>>;
