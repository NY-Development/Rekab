import { Response, NextFunction } from 'express';
import { CourseService } from '../services/courseService';
import { AuthenticatedRequest } from '../../../middlewares/auth';
import { CourseFilterSchema, UpdateCourseSchema } from '../validators/courseValidator';
import { assertCourseAccess } from '../../../services/accessControl.service';

export class CourseController {
  constructor(private courseService: CourseService) {}

  async listCourses(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await CourseFilterSchema.parseAsync(req.query);
      const result = await this.courseService.listCourses(validated);
      res.status(200).json({
        status: 'success',
        data: {
          docs: result.docs,
          total: result.total,
          page: validated.page,
          limit: validated.limit,
          totalPages: Math.ceil(result.total / validated.limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getCourseDetails(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    try {
      const course = await this.courseService.getCourseDetails(id);
      res.json({
        status: 'success',
        data: course
      });
    } catch (error) {
      next(error);
    }
  }

  async createCourse(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const { title, description, category, difficulty, durationWeeks, price, image, syllabusSummary } = req.body;
    try {
      const course = await this.courseService.createCourse(
        req.user!.id,
        req.user!.name,
        {
          title,
          description,
          category,
          difficulty,
          durationWeeks,
          price,
          image,
          syllabusSummary
        }
      );
      res.status(201).json({
        status: 'success',
        data: course
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCourse(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await assertCourseAccess(req.user!, req.params.id);
      const validated = await UpdateCourseSchema.parseAsync(req.body);
      const course = await this.courseService.updateCourse(req.user!.id, req.user!.name, req.params.id, validated);
      res.status(200).json({ status: 'success', data: course });
    } catch (error) {
      next(error);
    }
  }

  async deleteCourse(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.courseService.deleteCourse(req.user!.id, req.user!.name, req.params.id);
      res.status(200).json({ status: 'success', message: 'Course deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async addModuleToCourse(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const { courseId } = req.params;
    const { title, description, order } = req.body;
    try {
      const newModule = await this.courseService.addModuleToCourse(
        req.user!.id,
        req.user!.name,
        courseId,
        { title, description, order }
      );
      res.status(201).json({
        status: 'success',
        data: { module: newModule }
      });
    } catch (error) {
      next(error);
    }
  }

  async addLessonToModule(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const { courseId, moduleId } = req.params;
    const { title, content, durationMinutes, videoUrl, resources } = req.body;
    try {
      const newLesson = await this.courseService.addLessonToModule(
        req.user!.id,
        req.user!.name,
        courseId,
        moduleId,
        { title, content, durationMinutes, videoUrl, resources }
      );
      res.status(201).json({
        status: 'success',
        data: { lesson: newLesson }
      });
    } catch (error) {
      next(error);
    }
  }

  async addAssignmentToModule(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const { courseId, moduleId } = req.params;
    const { title, description, maxPoints, dueDate, submissionType } = req.body;
    try {
      const newAssignment = await this.courseService.addAssignmentToModule(
        req.user!.id,
        req.user!.name,
        courseId,
        moduleId,
        { title, description, maxPoints, dueDate, submissionType }
      );
      res.status(201).json({
        status: 'success',
        data: { assignment: newAssignment }
      });
    } catch (error) {
      next(error);
    }
  }
}
