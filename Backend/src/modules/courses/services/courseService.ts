import { CourseRepository } from '../repositories/courseRepository';
import { CohortRepository } from '../../cohorts/repositories/cohortRepository';
import { Course, Module, Lesson, Assignment } from '../../../types';
import { AppError } from '../../../middlewares/errorHandler';
import { DBStore } from '../../../services/dbStore';
import { ensureCourseCohort } from '../../../services/cohortProvisioning.service';

export class CourseService {
  constructor(
    private courseRepository: CourseRepository,
    private cohortRepository: CohortRepository
  ) {}

  async listCourses(filters: {
    page: number;
    limit: number;
    search?: string;
    category?: string;
    difficulty?: string;
    status?: string;
  }): Promise<{ docs: Course[]; total: number }> {
    return this.courseRepository.findPaginated(filters);
  }

  async getCourseDetails(id: string): Promise<Course> {
    const course = await this.courseRepository.findById(id);
    if (!course) {
      throw new AppError('Course not found', 404);
    }
    return course;
  }

  async createCourse(userId: string, userName: string, courseData: Omit<Course, 'id' | 'modules'>): Promise<Course> {
    const course = await this.courseRepository.create(courseData);
    await ensureCourseCohort(this.cohortRepository, course);
    await DBStore.logActivity(userId, userName, 'COURSE_CREATE', `Created new course: "${courseData.title}"`);
    return course;
  }

  async updateCourse(userId: string, userName: string, id: string, updateData: Partial<Course>): Promise<Course> {
    const course = await this.getCourseDetails(id);
    const updated = await this.courseRepository.update(id, updateData);
    if (!updated) {
      throw new AppError('Failed to update course', 500);
    }
    await DBStore.logActivity(userId, userName, 'COURSE_UPDATE', `Updated course: "${course.title}"`);
    return updated;
  }

  async deleteCourse(userId: string, userName: string, id: string): Promise<void> {
    const course = await this.getCourseDetails(id);
    const deleted = await this.courseRepository.delete(id);
    if (!deleted) {
      throw new AppError('Failed to delete course', 500);
    }
    await DBStore.logActivity(userId, userName, 'COURSE_DELETE', `Deleted course: "${course.title}"`);
  }

  async addModuleToCourse(userId: string, userName: string, courseId: string, moduleData: { title: string; description: string; order?: number }): Promise<Module> {
    const course = await this.getCourseDetails(courseId);
    const newModule = await this.courseRepository.addModule(courseId, {
      courseId,
      title: moduleData.title,
      description: moduleData.description,
      order: moduleData.order ?? (course.modules?.length ?? 0) + 1
    });

    await DBStore.logActivity(userId, userName, 'MODULE_CREATE', `Added module "${moduleData.title}" to course: "${course.title}"`);
    return newModule;
  }

  async addLessonToModule(userId: string, userName: string, courseId: string, moduleId: string, lessonData: { title: string; content: string; durationMinutes: number; videoUrl?: string; resources?: any[] }): Promise<Lesson> {
    const course = await this.getCourseDetails(courseId);
    const modules = course.modules || [];
    const moduleIdx = modules.findIndex((m: Module) => m.id === moduleId);
    if (moduleIdx === -1) {
      throw new AppError('Module not found in this course', 404);
    }

    const newLesson: Lesson = {
      id: `l-${Date.now()}`,
      title: lessonData.title,
      content: lessonData.content,
      durationMinutes: lessonData.durationMinutes,
      videoUrl: lessonData.videoUrl,
      resources: lessonData.resources
    };

    if (!modules[moduleIdx].lessons) modules[moduleIdx].lessons = [];
    modules[moduleIdx].lessons!.push(newLesson);
    await this.courseRepository.updateCourseModules(courseId, modules);

    await DBStore.logActivity(userId, userName, 'LESSON_CREATE', `Added lesson "${lessonData.title}" to module: "${modules[moduleIdx].title}"`);
    return newLesson;
  }

  async addAssignmentToModule(userId: string, userName: string, courseId: string, moduleId: string, assignmentData: { title: string; description: string; maxPoints: number; dueDate: string; submissionType: 'github' | 'text' | 'file' }): Promise<Assignment> {
    const course = await this.getCourseDetails(courseId);
    const modules = course.modules || [];
    const moduleIdx = modules.findIndex((m: Module) => m.id === moduleId);
    if (moduleIdx === -1) {
      throw new AppError('Module not found in this course', 404);
    }

    const newAssignment: Assignment = {
      id: `a-${Date.now()}`,
      moduleId,
      title: assignmentData.title,
      description: assignmentData.description,
      maxPoints: assignmentData.maxPoints,
      dueDate: assignmentData.dueDate,
      submissionType: assignmentData.submissionType
    };

    if (!modules[moduleIdx].assignments) modules[moduleIdx].assignments = [];
    modules[moduleIdx].assignments.push(newAssignment);
    await this.courseRepository.updateCourseModules(courseId, modules);

    await DBStore.logActivity(userId, userName, 'ASSIGNMENT_CREATE', `Added assignment "${assignmentData.title}" to module: "${modules[moduleIdx].title}"`);
    return newAssignment;
  }
}
