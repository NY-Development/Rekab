import CurriculumModel from '../models/Curriculum';
import ModuleModel from '../models/Module';
import LessonModel from '../models/Lesson';
import { Curriculum, Module, Lesson } from '../../../types';
import { isMongoConnected } from '../../../configs/db';

const CurriculumM = CurriculumModel as any;
const ModuleM = ModuleModel as any;
const LessonM = LessonModel as any;

export class CurriculumRepository {
  // --- Curriculum Repo Methods ---
  async findCurriculumById(id: string): Promise<Curriculum | null> {
    if (isMongoConnected) {
      const doc = await CurriculumM.findById(id);
      return doc ? (doc.toJSON() as Curriculum) : null;
    }
    return null;
  }

  async findCurriculumsByCourseId(courseId: string): Promise<Curriculum[]> {
    if (isMongoConnected) {
      const docs = await CurriculumM.find({ courseId }).sort({ order: 1 });
      return docs.map((d: any) => d.toJSON() as Curriculum);
    }
    return [];
  }

  async createCurriculum(data: Omit<Curriculum, 'id' | 'createdAt' | 'updatedAt'>): Promise<Curriculum> {
    if (isMongoConnected) {
      const doc = await CurriculumM.create(data);
      return doc.toJSON() as Curriculum;
    }
    throw new Error('Database not connected');
  }

  async updateCurriculum(id: string, updateData: Partial<Curriculum>): Promise<Curriculum | null> {
    if (isMongoConnected) {
      const doc = await CurriculumM.findByIdAndUpdate(
        id,
        { $set: { ...updateData, updatedAt: new Date().toISOString() } },
        { new: true }
      );
      return doc ? (doc.toJSON() as Curriculum) : null;
    }
    return null;
  }

  async deleteCurriculum(id: string): Promise<boolean> {
    if (isMongoConnected) {
      const result = await CurriculumM.findByIdAndDelete(id);
      return !!result;
    }
    return false;
  }

  // --- Module Repo Methods ---
  async findModuleById(id: string): Promise<Module | null> {
    if (isMongoConnected) {
      const doc = await ModuleM.findById(id);
      return doc ? (doc.toJSON() as Module) : null;
    }
    return null;
  }

  async findModulesByCourseId(courseId: string): Promise<Module[]> {
    if (isMongoConnected) {
      const docs = await ModuleM.find({ courseId }).sort({ order: 1 });
      return docs.map((d: any) => d.toJSON() as Module);
    }
    return [];
  }

  async findModulesByCurriculumId(curriculumId: string): Promise<Module[]> {
    if (isMongoConnected) {
      const docs = await ModuleM.find({ curriculumId }).sort({ order: 1 });
      return docs.map((d: any) => d.toJSON() as Module);
    }
    return [];
  }

  async createModule(data: Omit<Module, 'id' | 'lessons' | 'assignments' | 'createdAt' | 'updatedAt'>): Promise<Module> {
    if (isMongoConnected) {
      const doc = await ModuleM.create(data);
      return doc.toJSON() as Module;
    }
    throw new Error('Database not connected');
  }

  async updateModule(id: string, updateData: Partial<Module>): Promise<Module | null> {
    if (isMongoConnected) {
      const doc = await ModuleM.findByIdAndUpdate(
        id,
        { $set: { ...updateData, updatedAt: new Date().toISOString() } },
        { new: true }
      );
      return doc ? (doc.toJSON() as Module) : null;
    }
    return null;
  }

  async deleteModule(id: string): Promise<boolean> {
    if (isMongoConnected) {
      const result = await ModuleM.findByIdAndDelete(id);
      return !!result;
    }
    return false;
  }

  // --- Lesson Repo Methods ---
  async findLessonById(id: string): Promise<Lesson | null> {
    if (isMongoConnected) {
      const doc = await LessonM.findById(id);
      return doc ? (doc.toJSON() as Lesson) : null;
    }
    return null;
  }

  async findLessonsByModuleId(moduleId: string): Promise<Lesson[]> {
    if (isMongoConnected) {
      const docs = await LessonM.find({ moduleId }).sort({ order: 1 });
      return docs.map((d: any) => d.toJSON() as Lesson);
    }
    return [];
  }

  async createLesson(data: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lesson> {
    if (isMongoConnected) {
      const doc = await LessonM.create(data);
      return doc.toJSON() as Lesson;
    }
    throw new Error('Database not connected');
  }

  async updateLesson(id: string, updateData: Partial<Lesson>): Promise<Lesson | null> {
    if (isMongoConnected) {
      const doc = await LessonM.findByIdAndUpdate(
        id,
        { $set: { ...updateData, updatedAt: new Date().toISOString() } },
        { new: true }
      );
      return doc ? (doc.toJSON() as Lesson) : null;
    }
    return null;
  }

  async deleteLesson(id: string): Promise<boolean> {
    if (isMongoConnected) {
      const result = await LessonM.findByIdAndDelete(id);
      return !!result;
    }
    return false;
  }
}
