import { Assignment, Course, Cohort, User } from '../../../types';

export interface AssignmentDto extends Assignment {
  course?: Partial<Course>;
  cohort?: Partial<Cohort>;
  creator?: Partial<User>;
}

export type CreateAssignmentDto = Omit<Assignment, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>;
export type UpdateAssignmentDto = Partial<Omit<Assignment, 'id' | 'courseId' | 'cohortId' | 'moduleId' | 'createdAt' | 'updatedAt' | 'createdBy'>>;
