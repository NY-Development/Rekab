import { Curriculum, Module, Lesson } from '../../../types';

export interface CurriculumWithModules extends Curriculum {
  modules: ModuleWithLessons[];
}

export interface ModuleWithLessons extends Module {
  lessons: Lesson[];
}

export type CreateCurriculumDto = Omit<Curriculum, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCurriculumDto = Partial<Omit<Curriculum, 'id' | 'courseId' | 'createdAt' | 'updatedAt'>>;

export type CreateModuleDto = Omit<Module, 'id' | 'lessons' | 'assignments' | 'createdAt' | 'updatedAt'>;
export type UpdateModuleDto = Partial<Omit<Module, 'id' | 'courseId' | 'lessons' | 'assignments' | 'createdAt' | 'updatedAt'>>;

export type CreateLessonDto = Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateLessonDto = Partial<Omit<Lesson, 'id' | 'moduleId' | 'createdAt' | 'updatedAt'>>;
