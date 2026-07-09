import { Announcement, Course, Cohort, Team, User } from '../../../types';

export interface AnnouncementDto extends Announcement {
  course?: Partial<Course>;
  cohort?: Partial<Cohort>;
  team?: Partial<Team>;
  creator?: Partial<User>; 
}

export type CreateAnnouncementDto = Omit<Announcement, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'> & { publishDate?: string };
export type UpdateAnnouncementDto = Partial<Omit<Announcement, 'id' | 'courseId' | 'cohortId' | 'teamId' | 'createdAt' | 'updatedAt' | 'createdBy'>>;
