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

  async update(id: string, updateData: Partial<Course>): Promise<Course | null> {
    if (isMongoConnected) {
      const doc = await CourseM.findByIdAndUpdate(
        id,
        { $set: { ...updateData, updatedAt: new Date().toISOString() } },
        { new: true }
      );
      return doc ? (doc.toJSON() as Course) : null;
    }
    return null;
  }

  async delete(id: string): Promise<boolean> {
    if (isMongoConnected) {
      const result = await CourseM.findByIdAndDelete(id);
      return !!result;
    }
    return false;
  }

  async findPaginated(filters: {
    page: number;
    limit: number;
    search?: string;
    category?: string;
    difficulty?: string;
    status?: string;
  }): Promise<{ docs: Course[]; total: number }> {
    if (!isMongoConnected) {
      return { docs: [], total: 0 };
    }

    const { page, limit, search, category, difficulty, status } = filters;
    const query: Record<string, any> = {};

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const total = await CourseM.countDocuments(query);
    const docs = await CourseM.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

    return { docs: docs.map((d: any) => d.toJSON() as Course), total };
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
