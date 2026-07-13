import { Enrollment, User, Course, Cohort, Team, Payment } from '../../../types';

export interface EnrollmentDto extends Enrollment {
  student?: Partial<User>;
  course?: Partial<Course>;
  cohort?: Partial<Cohort>;
  team?: Partial<Team>;
  payment?: Partial<Payment>;
}

export type CreateEnrollmentDto = Omit<Enrollment, 'id' | 'progressPercentage' | 'certificateIssued' | 'certificateUrl' | 'enrolledAt' | 'completedAt' | 'status' | 'createdAt' | 'updatedAt' | 'cohortId'> & { cohortId?: string };

export type UpdateEnrollmentDto = Partial<Omit<Enrollment, 'id' | 'studentId' | 'courseId' | 'cohortId' | 'createdAt' | 'updatedAt'>>;
