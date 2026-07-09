import { Team, User } from '../../../types';

export interface TeamDto extends Team {
  cohort?: any;
  mentor?: Partial<User>;
  leader?: Partial<User>;
  members?: Partial<User>[];
}

export type CreateTeamDto = Omit<Team, 'id' | 'score' | 'createdAt' | 'updatedAt'>;
export type UpdateTeamDto = Partial<Omit<Team, 'id' | 'cohortId' | 'teamCode' | 'createdAt' | 'updatedAt'>>;
