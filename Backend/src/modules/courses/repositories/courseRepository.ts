import CourseModel from '../models/Course';
import { Course, Module } from '../../../types';
import { DBStore } from '../../../services/dbStore';
import { isMongoConnected } from '../../../configs/db';

const CourseM = CourseModel as any;

export class CourseRepository {
  async findAll(): Promise<Course[]> {
    if (isMongoConnected) {
      const docs = await CourseM.find({});
      return docs.map((d: any) => d.toJSON() as Course);
    }
    return DBStore.getCourses();
  }

  async findById(id: string): Promise<Course | null> {
    if (isMongoConnected) {
      const doc = await CourseM.findById(id);
      return doc ? (doc.toJSON() as Course) : null;
    }
    return DBStore.getCourseById(id);
  }

  async create(courseData: Omit<Course, 'id' | 'modules'>): Promise<Course> {
    if (isMongoConnected) {
      const slug = courseData.slug || courseData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const code = courseData.code || `NYDL-${courseData.title.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;
      const status = courseData.status || 'draft';
      const normalized = {
        ...courseData,
        slug,
        code,
        status,
        modules: []
      };
      const doc = await CourseM.create(normalized);
      return doc.toJSON() as Course;
    }
    return DBStore.createCourse(courseData);
  }

  async addModule(courseId: string, moduleData: Omit<Module, 'id' | 'lessons' | 'assignments'>): Promise<Module> {
    return DBStore.addModule(courseId, moduleData);
  }

  async updateCourseModules(courseId: string, modules: Module[]): Promise<Course | null> {
    if (isMongoConnected) {
      const doc = await CourseM.findByIdAndUpdate(
        courseId,
        { $set: { modules } },
        { new: true }
      );
      return doc ? (doc.toJSON() as Course) : null;
    }
    return DBStore.updateCourseModules(courseId, modules);
  }
}
