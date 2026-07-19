import { CertificateRepository } from '../repositories/certificateRepository';
import { CourseRepository } from '../../courses/repositories/courseRepository';
import { IssueCertificateDto, CertificateDto } from '../dtos/certificateDto';
import { AppError } from '../../../middlewares/errorHandler';
import { DBStore } from '../../../services/dbStore';
import { generateCertificate, CertificateLayout, DEFAULT_LAYOUT } from '../../../services/certificateGenerator.service';
import { CURRENT_BATCH } from '../../../services/cohortProvisioning.service';
import crypto from 'crypto';

export interface GenerateCertificatesInput {
  templateUrl: string;
  courseId: string;
  cohortId: string;
  batch?: string;
  studentIds: string[];
  layout?: CertificateLayout;
}

export class CertificateService {
  constructor(
    private certificateRepository: CertificateRepository,
    private courseRepository?: CourseRepository
  ) {}

  private generateCertificateNumber(): string {
    const prefix = 'NYDL';
    const year = new Date().getFullYear();
    const random = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `${prefix}-${year}-${random}`;
  }

  async getCertificateById(id: string): Promise<CertificateDto> {
    const cert = await this.certificateRepository.findById(id);
    if (!cert) {
      throw new AppError('Certificate not found', 404);
    }
    return cert;
  }

  async verifyCertificate(certificateNumber: string): Promise<CertificateDto> {
    const cert = await this.certificateRepository.findByNumber(certificateNumber);
    if (!cert) {
      throw new AppError('Certificate not found — invalid certificate number', 404);
    }
    return cert;
  }

  async getStudentCertificates(studentId: string): Promise<CertificateDto[]> {
    return this.certificateRepository.findByStudentId(studentId);
  }

  async issueCertificate(data: IssueCertificateDto): Promise<CertificateDto> {
    const certificateNumber = this.generateCertificateNumber();
    const payload = {
      ...data,
      certificateNumber,
      issueDate: new Date().toISOString(),
    };
    return this.certificateRepository.create(payload);
  }

  /**
   * Generates certificates for a set of students from an uploaded template:
   * overlays each student's name + course + batch, uploads the PDF, and stores
   * a Certificate record (which then surfaces in the student's portal).
   */
  async generateBatch(input: GenerateCertificatesInput): Promise<{ issued: CertificateDto[]; failed: { studentId: string; reason: string }[] }> {
    const batch = input.batch || CURRENT_BATCH;
    const layout: CertificateLayout = input.layout || DEFAULT_LAYOUT;
    const course = this.courseRepository ? await this.courseRepository.findById(input.courseId) : null;
    const courseTitle = course?.title || 'NYDL Program';

    const issued: CertificateDto[] = [];
    const failed: { studentId: string; reason: string }[] = [];

    for (const studentId of input.studentIds) {
      try {
        const student = await DBStore.getUserById(studentId);
        if (!student) {
          failed.push({ studentId, reason: 'Student not found' });
          continue;
        }
        const certificateNumber = this.generateCertificateNumber();
        const pdfUrl = await generateCertificate(
          input.templateUrl,
          { studentName: student.name, courseTitle, batch },
          certificateNumber,
          layout
        );
        const cert = await this.certificateRepository.create({
          studentId,
          courseId: input.courseId,
          cohortId: input.cohortId,
          certificateNumber,
          issueDate: new Date().toISOString(),
          pdfUrl,
          credentialUrl: pdfUrl,
          metadata: { studentName: student.name, courseTitle, batch, templateUrl: input.templateUrl },
        } as any);
        issued.push(cert);
      } catch (err) {
        failed.push({ studentId, reason: (err as Error).message });
      }
    }

    return { issued, failed };
  }

  async revokeCertificate(id: string): Promise<void> {
    const cert = await this.certificateRepository.findById(id);
    if (!cert) {
      throw new AppError('Certificate not found', 404);
    }
    const deleted = await this.certificateRepository.delete(id);
    if (!deleted) {
      throw new AppError('Failed to revoke certificate', 500);
    }
  }

  async listCertificates(filters: {
    page: number;
    limit: number;
    studentId?: string;
    courseId?: string;
    cohortId?: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<{ docs: CertificateDto[]; total: number }> {
    return this.certificateRepository.findPaginated(filters);
  }
}
