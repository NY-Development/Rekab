import { StudentRepository } from '../repositories/studentRepository';
import { CreateStudentProfileDto, UpdateStudentProfileDto } from '../dtos/studentDto';
import { StudentProfile } from '../../../types';
import { AppError } from '../../../middlewares/errorHandler';

export class StudentService {
  constructor(private studentRepository: StudentRepository) {}

  async getProfileByUserId(userId: string): Promise<StudentProfile> {
    const profile = await this.studentRepository.findByUserId(userId);
    if (!profile) {
      throw new AppError('Student profile not found for this user', 404);
    }
    return profile;
  }

  async getProfileById(id: string): Promise<StudentProfile> {
    const profile = await this.studentRepository.findById(id);
    if (!profile) {
      throw new AppError('Student profile not found', 404);
    }
    return profile;
  }

  async createProfile(data: CreateStudentProfileDto): Promise<StudentProfile> {
    const existingUser = await this.studentRepository.findByUserId(data.userId);
    if (existingUser) {
      throw new AppError('Student profile already exists for this user', 409);
    }

    const existingCode = await this.studentRepository.findByStudentCode(data.studentCode);
    if (existingCode) {
      throw new AppError('Student code is already in use', 409);
    }

    return this.studentRepository.create(data);
  }

  async updateProfile(id: string, updateData: UpdateStudentProfileDto): Promise<StudentProfile> {
    const profile = await this.studentRepository.findById(id);
    if (!profile) {
      throw new AppError('Student profile not found', 404);
    }

    const updated = await this.studentRepository.update(id, updateData);
    if (!updated) {
      throw new AppError('Failed to update student profile', 500);
    }
    return updated;
  }

  async getStudents(filters: {
    page: number;
    limit: number;
    search?: string;
    currentLevel?: string;
    graduationStatus?: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<{ docs: StudentProfile[]; total: number }> {
    return this.studentRepository.findPaginated(filters);
  }
}
