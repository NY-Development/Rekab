import { AssignmentRepository } from '../repositories/assignmentRepository';
import { CreateAssignmentDto, UpdateAssignmentDto } from '../dtos/assignmentDto';
import { Assignment } from '../../../types';
import { AppError } from '../../../middlewares/errorHandler';

export class AssignmentService {
  constructor(private assignmentRepository: AssignmentRepository) {}

  async getAssignmentById(id: string): Promise<Assignment> {
    const assignment = await this.assignmentRepository.findById(id);
    if (!assignment) {
      throw new AppError('Assignment not found', 404);
    }
    return assignment;
  }

  async getCohortAssignments(cohortId: string): Promise<Assignment[]> {
    return this.assignmentRepository.findByCohortId(cohortId);
  }

  async createAssignment(creatorId: string, data: CreateAssignmentDto): Promise<Assignment> {
    const payload = {
      ...data,
      createdBy: creatorId,
    };
    return this.assignmentRepository.create(payload);
  }

  async updateAssignment(id: string, updateData: UpdateAssignmentDto): Promise<Assignment> {
    const assignment = await this.assignmentRepository.findById(id);
    if (!assignment) {
      throw new AppError('Assignment not found', 404);
    }
    const updated = await this.assignmentRepository.update(id, updateData);
    if (!updated) {
      throw new AppError('Failed to update assignment', 500);
    }
    return updated;
  }

  async deleteAssignment(id: string): Promise<void> {
    const assignment = await this.assignmentRepository.findById(id);
    if (!assignment) {
      throw new AppError('Assignment not found', 404);
    }
    const deleted = await this.assignmentRepository.delete(id);
    if (!deleted) {
      throw new AppError('Failed to delete assignment', 500);
    }
  }

  async listAssignments(filters: {
    page: number;
    limit: number;
    cohortId?: string;
    cohortIds?: string[];
    courseId?: string;
    moduleId?: string;
    assignmentType?: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<{ docs: Assignment[]; total: number }> {
    return this.assignmentRepository.findPaginated(filters);
  }
}
