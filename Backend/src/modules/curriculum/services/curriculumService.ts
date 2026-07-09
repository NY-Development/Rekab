import { CurriculumRepository } from '../repositories/curriculumRepository';
import { 
  CreateCurriculumDto, UpdateCurriculumDto, 
  CreateModuleDto, UpdateModuleDto, 
  CreateLessonDto, UpdateLessonDto,
  CurriculumWithModules
} from '../dtos/curriculumDto';
import { Curriculum, Module, Lesson } from '../../../types';
import { AppError } from '../../../middlewares/errorHandler';

export class CurriculumService {
  constructor(private curriculumRepository: CurriculumRepository) {}

  // --- Curriculum Services ---
  async getCurriculums(courseId: string): Promise<Curriculum[]> {
    return this.curriculumRepository.findCurriculumsByCourseId(courseId);
  }

  async getCurriculumDetail(courseId: string): Promise<CurriculumWithModules[]> {
    const curriculums = await this.curriculumRepository.findCurriculumsByCourseId(courseId);
    const detailList: CurriculumWithModules[] = [];

    for (const cur of curriculums) {
      const dbModules = await this.curriculumRepository.findModulesByCurriculumId(cur.id);
      const modulesWithLessons = [];

      for (const mod of dbModules) {
        const lessons = await this.curriculumRepository.findLessonsByModuleId(mod.id);
        modulesWithLessons.push({
          ...mod,
          lessons,
        });
      }

      detailList.push({
        ...cur,
        modules: modulesWithLessons,
      });
    }

    return detailList;
  }

  async createCurriculum(data: CreateCurriculumDto): Promise<Curriculum> {
    return this.curriculumRepository.createCurriculum(data);
  }

  async updateCurriculum(id: string, updateData: UpdateCurriculumDto): Promise<Curriculum> {
    const cur = await this.curriculumRepository.findCurriculumById(id);
    if (!cur) {
      throw new AppError('Curriculum not found', 404);
    }
    const updated = await this.curriculumRepository.updateCurriculum(id, updateData);
    if (!updated) {
      throw new AppError('Failed to update curriculum', 500);
    }
    return updated;
  }

  async deleteCurriculum(id: string): Promise<void> {
    const cur = await this.curriculumRepository.findCurriculumById(id);
    if (!cur) {
      throw new AppError('Curriculum not found', 404);
    }
    const deleted = await this.curriculumRepository.deleteCurriculum(id);
    if (!deleted) {
      throw new AppError('Failed to delete curriculum', 500);
    }
  }

  // --- Module Services ---
  async getModules(courseId: string, curriculumId?: string): Promise<Module[]> {
    if (curriculumId) {
      return this.curriculumRepository.findModulesByCurriculumId(curriculumId);
    }
    return this.curriculumRepository.findModulesByCourseId(courseId);
  }

  async createModule(data: CreateModuleDto): Promise<Module> {
    return this.curriculumRepository.createModule(data);
  }

  async updateModule(id: string, updateData: UpdateModuleDto): Promise<Module> {
    const mod = await this.curriculumRepository.findModuleById(id);
    if (!mod) {
      throw new AppError('Module not found', 404);
    }
    const updated = await this.curriculumRepository.updateModule(id, updateData);
    if (!updated) {
      throw new AppError('Failed to update module', 500);
    }
    return updated;
  }

  async deleteModule(id: string): Promise<void> {
    const mod = await this.curriculumRepository.findModuleById(id);
    if (!mod) {
      throw new AppError('Module not found', 404);
    }
    const deleted = await this.curriculumRepository.deleteModule(id);
    if (!deleted) {
      throw new AppError('Failed to delete module', 500);
    }
  }

  // --- Lesson Services ---
  async getLessons(moduleId: string): Promise<Lesson[]> {
    return this.curriculumRepository.findLessonsByModuleId(moduleId);
  }

  async createLesson(data: CreateLessonDto): Promise<Lesson> {
    return this.curriculumRepository.createLesson(data);
  }

  async updateLesson(id: string, updateData: UpdateLessonDto): Promise<Lesson> {
    const lesson = await this.curriculumRepository.findLessonById(id);
    if (!lesson) {
      throw new AppError('Lesson not found', 404);
    }
    const updated = await this.curriculumRepository.updateLesson(id, updateData);
    if (!updated) {
      throw new AppError('Failed to update lesson', 500);
    }
    return updated;
  }

  async deleteLesson(id: string): Promise<void> {
    const lesson = await this.curriculumRepository.findLessonById(id);
    if (!lesson) {
      throw new AppError('Lesson not found', 404);
    }
    const deleted = await this.curriculumRepository.deleteLesson(id);
    if (!deleted) {
      throw new AppError('Failed to delete lesson', 500);
    }
  }
}
