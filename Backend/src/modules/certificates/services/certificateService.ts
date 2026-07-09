import { CertificateRepository } from '../repositories/certificateRepository';
import { IssueCertificateDto, CertificateDto } from '../dtos/certificateDto';
import { AppError } from '../../../middlewares/errorHandler';
import crypto from 'crypto';

export class CertificateService {
  constructor(private certificateRepository: CertificateRepository) {}

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
