import { Request, Response, NextFunction } from 'express';
import { CurriculumService } from '../services/curriculumService';
import { 
  CreateCurriculumSchema, UpdateCurriculumSchema, 
  CreateModuleSchema, UpdateModuleSchema, 
  CreateLessonSchema, UpdateLessonSchema 
} from '../validators/curriculumValidator';

export class CurriculumController {
  constructor(private curriculumService: CurriculumService) {}

  // --- Curriculum Handlers ---
  async getCurriculums(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const courseId = req.query.courseId as string;
      if (!courseId) {
        res.status(400).json({ status: 'error', message: 'courseId query parameter is required' });
        return;
      }
      const list = await this.curriculumService.getCurriculums(courseId);
      res.status(200).json({ status: 'success', data: list });
    } catch (error) {
      next(error);
    }
  }

  async getCurriculumDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const courseId = req.query.courseId as string;
      if (!courseId) {
        res.status(400).json({ status: 'error', message: 'courseId query parameter is required' });
        return;
      }
      const detail = await this.curriculumService.getCurriculumDetail(courseId);
      res.status(200).json({ status: 'success', data: detail });
    } catch (error) {
      next(error);
    }
  }

  async createCurriculum(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await CreateCurriculumSchema.parseAsync(req.body);
      const cur = await this.curriculumService.createCurriculum(validated);
      res.status(201).json({ status: 'success', data: cur });
    } catch (error) {
      next(error);
    }
  }

  async updateCurriculum(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await UpdateCurriculumSchema.parseAsync(req.body);
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const cur = await this.curriculumService.updateCurriculum(id, validated);
      res.status(200).json({ status: 'success', data: cur });
    } catch (error) {
      next(error);
    }
  }

  async deleteCurriculum(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await this.curriculumService.deleteCurriculum(id);
      res.status(200).json({ status: 'success', message: 'Curriculum deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  // --- Module Handlers ---
  async getModules(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const courseId = req.query.courseId as string;
      const curriculumId = req.query.curriculumId as string;
      if (!courseId) {
        res.status(400).json({ status: 'error', message: 'courseId query parameter is required' });
        return;
      }
      const list = await this.curriculumService.getModules(courseId, curriculumId);
      res.status(200).json({ status: 'success', data: list });
    } catch (error) {
      next(error);
    }
  }

  async createModule(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await CreateModuleSchema.parseAsync(req.body);
      const mod = await this.curriculumService.createModule(validated);
      res.status(201).json({ status: 'success', data: mod });
    } catch (error) {
      next(error);
    }
  }

  async updateModule(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await UpdateModuleSchema.parseAsync(req.body);
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const mod = await this.curriculumService.updateModule(id, validated);
      res.status(200).json({ status: 'success', data: mod });
    } catch (error) {
      next(error);
    }
  }

  async deleteModule(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await this.curriculumService.deleteModule(id);
      res.status(200).json({ status: 'success', message: 'Module deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  // --- Lesson Handlers ---
  async getLessons(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const moduleId = req.query.moduleId as string;
      if (!moduleId) {
        res.status(400).json({ status: 'error', message: 'moduleId query parameter is required' });
        return;
      }
      const list = await this.curriculumService.getLessons(moduleId);
      res.status(200).json({ status: 'success', data: list });
    } catch (error) {
      next(error);
    }
  }

  async createLesson(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await CreateLessonSchema.parseAsync(req.body);
      const lesson = await this.curriculumService.createLesson(validated);
      res.status(201).json({ status: 'success', data: lesson });
    } catch (error) {
      next(error);
    }
  }

  async updateLesson(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await UpdateLessonSchema.parseAsync(req.body);
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const lesson = await this.curriculumService.updateLesson(id, validated);
      res.status(200).json({ status: 'success', data: lesson });
    } catch (error) {
      next(error);
    }
  }

  async deleteLesson(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await this.curriculumService.deleteLesson(id);
      res.status(200).json({ status: 'success', message: 'Lesson deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
