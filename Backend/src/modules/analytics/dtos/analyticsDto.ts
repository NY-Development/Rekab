import { StudentActivity, ActivityLog, User } from '../../../types';

export interface StudentActivityDto extends StudentActivity {
  student?: Partial<User>;
}

export type LogStudentActivityDto = Omit<StudentActivity, 'id' | 'studentId' | 'timestamp'>;
export type CreateActivityLogDto = Omit<ActivityLog, 'id' | 'timestamp'>;
