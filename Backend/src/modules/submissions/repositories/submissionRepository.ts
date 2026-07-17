import SubmissionModel from '../models/Submission';
import { Submission } from '../../../types';
import { DBStore } from '../../../services/dbStore';
import { isMongoConnected } from '../../../configs/db';

const SubmissionM = SubmissionModel as any;

export class SubmissionRepository {
  async findAll(): Promise<Submission[]> {
    if (isMongoConnected) {
      const docs = await SubmissionM.find({});
      return docs.map((d: any) => d.toJSON() as Submission);
    }
    return DBStore.getSubmissions();
  }

  /**
   * Filters at the query level (letting Mongoose cast string ids to
   * ObjectId) instead of fetching everything and comparing in JS — a plain
   * `===` against an ObjectId field never matches a string filter value.
   */
  async findFiltered(filters: { cohortId?: string; studentId?: string; assignmentId?: string }): Promise<Submission[]> {
    if (isMongoConnected) {
      const query: Record<string, any> = {};
      if (filters.cohortId) query.cohortId = filters.cohortId;
      if (filters.studentId) query.studentId = filters.studentId;
      if (filters.assignmentId) query.assignmentId = filters.assignmentId;
      const docs = await SubmissionM.find(query);
      return docs.map((d: any) => d.toJSON() as Submission);
    }
    const all = await DBStore.getSubmissions();
    return all.filter((s) =>
      (!filters.cohortId || s.cohortId === filters.cohortId) &&
      (!filters.studentId || s.studentId === filters.studentId) &&
      (!filters.assignmentId || s.assignmentId === filters.assignmentId)
    );
  }

  async findById(id: string): Promise<Submission | null> {
    if (isMongoConnected) {
      const doc = await SubmissionM.findById(id);
      return doc ? (doc.toJSON() as Submission) : null;
    }
    const list = await DBStore.getSubmissions();
    return list.find(s => s.id === id) || null;
  }

  async create(submissionData: Omit<Submission, 'id'>): Promise<Submission> {
    if (isMongoConnected) {
      const doc = await SubmissionM.create(submissionData);
      return doc.toJSON() as Submission;
    }
    return DBStore.createSubmission(submissionData);
  }

  async grade(id: string, gradeData: { points: number; feedback: string; gradedBy: string }): Promise<Submission | null> {
    if (isMongoConnected) {
      const doc = await SubmissionM.findByIdAndUpdate(
        id,
        {
          $set: {
            points: gradeData.points,
            feedback: gradeData.feedback,
            gradedBy: gradeData.gradedBy,
            gradedAt: new Date().toISOString(),
            status: 'graded'
          }
        },
        { new: true }
      );
      return doc ? (doc.toJSON() as Submission) : null;
    }
    return DBStore.gradeSubmission(id, gradeData);
  }

  async findByStudent(studentId: string): Promise<Submission[]> {
    if (isMongoConnected) {
      const docs = await SubmissionM.find({ studentId });
      return docs.map((d: any) => d.toJSON() as Submission);
    }
    return DBStore.getSubmissionsByStudent(studentId);
  }
}
