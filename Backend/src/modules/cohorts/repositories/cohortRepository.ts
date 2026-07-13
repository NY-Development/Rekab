import CohortModel from '../models/Cohort';
import { Cohort, Enrollment } from '../../../types';
import { DBStore } from '../../../services/dbStore';
import { isMongoConnected } from '../../../configs/db';

const CohortM = CohortModel as any;

export class CohortRepository {
  async findAll(): Promise<Cohort[]> {
    if (isMongoConnected) {
      const docs = await CohortM.find({}).populate('courseId', 'title category code');
      return docs.map((d: any) => d.toJSON() as Cohort);
    }
    return DBStore.getCohorts();
  }

  async findById(id: string): Promise<Cohort | null> {
    if (isMongoConnected) {
      const doc = await CohortM.findById(id).populate('courseId', 'title category code');
      return doc ? (doc.toJSON() as Cohort) : null;
    }
    return DBStore.getCohortById(id);
  }

  async create(cohortData: Omit<Cohort, 'id'>): Promise<Cohort> {
    if (isMongoConnected) {
      const doc = await CohortM.create(cohortData);
      return doc.toJSON() as Cohort;
    }
    return DBStore.createCohort(cohortData);
  }

  async update(id: string, updateData: Partial<Cohort>): Promise<Cohort | null> {
    if (isMongoConnected) {
      const doc = await CohortM.findByIdAndUpdate(id, { $set: updateData }, { new: true });
      return doc ? (doc.toJSON() as Cohort) : null;
    }
    return DBStore.updateCohort(id, updateData);
  }

  async createEnrollment(enrollmentData: Omit<Enrollment, 'id'>): Promise<Enrollment> {
    return DBStore.createEnrollment(enrollmentData);
  }

  async delete(id: string): Promise<boolean> {
    if (isMongoConnected) {
      const result = await CohortM.findByIdAndDelete(id);
      return !!result;
    }
    return false;
  }

  async findPaginated(filters: {
    page: number;
    limit: number;
    courseId?: string;
    studentId?: string;
  }): Promise<{ docs: Cohort[]; total: number }> {
    if (!isMongoConnected) {
      return { docs: [], total: 0 };
    }

    const { page, limit, courseId, studentId } = filters;
    const query: Record<string, any> = {};
    if (courseId) query.courseId = courseId;
    if (studentId) query.students = studentId;

    const skip = (page - 1) * limit;
    const total = await CohortM.countDocuments(query);
    const docs = await CohortM.find(query)
      .populate('courseId', 'title category code')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return { docs: docs.map((d: any) => d.toJSON() as Cohort), total };
  }
}
