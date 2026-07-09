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
