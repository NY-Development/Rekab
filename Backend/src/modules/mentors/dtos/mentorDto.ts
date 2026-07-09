import { MentorProfile, User } from '../../../types';

export interface MentorProfileDto extends MentorProfile {
  user?: Partial<User>;
}

export type CreateMentorProfileDto = Omit<MentorProfile, 'id' | 'assignedTeams' | 'assignedStudents' | 'createdAt' | 'updatedAt'>;

export type UpdateMentorProfileDto = Partial<Omit<MentorProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>;
