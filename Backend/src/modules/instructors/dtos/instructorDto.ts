import { InstructorProfile, User } from '../../../types';

export interface InstructorProfileDto extends InstructorProfile {
  user?: Partial<User>;
}

export type CreateInstructorProfileDto = Omit<InstructorProfile, 'id' | 'rating' | 'totalStudents' | 'createdAt' | 'updatedAt'>;

export type UpdateInstructorProfileDto = Partial<Omit<InstructorProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>;
