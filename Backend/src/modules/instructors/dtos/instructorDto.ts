import { InstructorProfile, User } from '../../../types';

export interface InstructorProfileDto extends InstructorProfile {
  user?: Partial<User>;
}

export interface CreateInstructorProfileDto {
  userId?: string;
  name?: string;
  email?: string;
  specialization?: string;
  yearsExperience?: number;
  bio?: string;
  skills?: string[];
  assignedCourses?: string[];
}

export type UpdateInstructorProfileDto = Partial<Omit<InstructorProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>;
