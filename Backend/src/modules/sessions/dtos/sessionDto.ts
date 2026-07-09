import { Session, User, Course, Cohort } from '../../../types';

export interface SessionDto extends Session {
  course?: Partial<Course>;
  cohort?: Partial<Cohort>;
  instructor?: Partial<User>;
}

export type CreateSessionDto = Omit<Session, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateSessionDto = Partial<Omit<Session, 'id' | 'courseId' | 'cohortId' | 'createdAt' | 'updatedAt'>>;
