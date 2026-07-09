import CertificateModel from '../models/Certificate';
import { isMongoConnected } from '../../../configs/db';
import { CertificateDto } from '../dtos/certificateDto';

const CertificateM = CertificateModel as any;

export class CertificateRepository {
  async findById(id: string): Promise<CertificateDto | null> {
    if (isMongoConnected) {
      const doc = await CertificateM.findById(id)
        .populate('studentId', 'name email role avatar firstName lastName')
        .populate('courseId', 'title category slug thumbnail price code')
        .populate('cohortId', 'name code startDate endDate status');
      return doc ? (doc.toJSON() as CertificateDto) : null;
    }
    return null;
  }

  async findByNumber(certificateNumber: string): Promise<CertificateDto | null> {
    if (isMongoConnected) {
      const doc = await CertificateM.findOne({ certificateNumber })
        .populate('studentId', 'name email role avatar firstName lastName')
        .populate('courseId', 'title category slug thumbnail price code')
        .populate('cohortId', 'name code startDate endDate status');
      return doc ? (doc.toJSON() as CertificateDto) : null;
    }
    return null;
  }

  async findByStudentId(studentId: string): Promise<CertificateDto[]> {
    if (isMongoConnected) {
      const docs = await CertificateM.find({ studentId })
        .populate('studentId', 'name email role avatar firstName lastName')
        .populate('courseId', 'title category slug thumbnail price code')
        .populate('cohortId', 'name code startDate endDate status')
        .sort({ issueDate: -1 });
      return docs.map((d: any) => d.toJSON() as CertificateDto);
    }
    return [];
  }

  async create(data: any): Promise<CertificateDto> {
    if (isMongoConnected) {
      const doc = await CertificateM.create(data);
      return doc.toJSON() as CertificateDto;
    }
    throw new Error('Database not connected');
  }

  async delete(id: string): Promise<boolean> {
    if (isMongoConnected) {
      const result = await CertificateM.findByIdAndDelete(id);
      return !!result;
    }
    return false;
  }

  async findPaginated(filters: {
    page: number;
    limit: number;
    studentId?: string;
    courseId?: string;
    cohortId?: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<{ docs: CertificateDto[]; total: number }> {
    if (!isMongoConnected) {
      return { docs: [], total: 0 };
    }

    const { page, limit, studentId, courseId, cohortId, sortBy, sortOrder } = filters;
    const query: Record<string, any> = {};

    if (studentId) query.studentId = studentId;
    if (courseId) query.courseId = courseId;
    if (cohortId) query.cohortId = cohortId;

    const skip = (page - 1) * limit;

    const total = await CertificateM.countDocuments(query);
    const docs = await CertificateM.find(query)
      .populate('studentId', 'name email role avatar firstName lastName')
      .populate('courseId', 'title category slug thumbnail price code')
      .populate('cohortId', 'name code startDate endDate status')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    return {
      docs: docs.map((d: any) => d.toJSON() as CertificateDto),
      total
    };
  }
}
