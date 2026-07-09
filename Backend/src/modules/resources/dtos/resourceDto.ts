import { Resource, Course, User } from '../../../types';

export interface ResourceDto extends Resource {
  course?: Partial<Course>;
  uploader?: Partial<User>;
}

export type CreateResourceDto = Omit<Resource, 'id' | 'createdAt' | 'updatedAt' | 'uploadedBy'>;
export type UpdateResourceDto = Partial<Omit<Resource, 'id' | 'courseId' | 'createdAt' | 'updatedAt' | 'uploadedBy'>>;
