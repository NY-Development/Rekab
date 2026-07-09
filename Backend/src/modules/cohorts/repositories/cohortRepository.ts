import CohortModel from '../models/Cohort';
import { Cohort, Enrollment } from '../../../types';
import { DBStore } from '../../../services/dbStore';
import { isMongoConnected } from '../../../configs/db';

const CohortM = CohortModel as any;

export class CohortRepository {
  async findAll(): Promise<Cohort[]> {
    if (isMongoConnected) {
      const docs = await CohortM.find({});
      return docs.map((d: any) => d.toJSON() as Cohort);
    }
    return DBStore.getCohorts();
  }

  async findById(id: string): Promise<Cohort | null> {
    if (isMongoConnected) {
      const doc = await CohortM.findById(id);
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
}
