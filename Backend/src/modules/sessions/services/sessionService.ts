import { SessionRepository } from '../repositories/sessionRepository';
import { CreateSessionDto, UpdateSessionDto } from '../dtos/sessionDto';
import { Session } from '../../../types';
import { AppError } from '../../../middlewares/errorHandler';

export class SessionService {
  constructor(private sessionRepository: SessionRepository) {}

  async getSessionById(id: string): Promise<Session> {
    const session = await this.sessionRepository.findById(id);
    if (!session) {
      throw new AppError('Session not found', 404);
    }
    return session;
  }

  async getCohortSessions(cohortId: string): Promise<Session[]> {
    return this.sessionRepository.findByCohortId(cohortId);
  }

  async createSession(data: CreateSessionDto): Promise<Session> {
    return this.sessionRepository.create(data);
  }

  async updateSession(id: string, updateData: UpdateSessionDto): Promise<Session> {
    const session = await this.sessionRepository.findById(id);
    if (!session) {
      throw new AppError('Session not found', 404);
    }
    const updated = await this.sessionRepository.update(id, updateData);
    if (!updated) {
      throw new AppError('Failed to update session', 500);
    }
    return updated;
  }

  async deleteSession(id: string): Promise<void> {
    const session = await this.sessionRepository.findById(id);
    if (!session) {
      throw new AppError('Session not found', 404);
    }
    const deleted = await this.sessionRepository.delete(id);
    if (!deleted) {
      throw new AppError('Failed to delete session', 500);
    }
  }

  async listSessions(filters: {
    page: number;
    limit: number;
    cohortId?: string;
    cohortIds?: string[];
    courseId?: string;
    instructorId?: string;
    status?: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<{ docs: Session[]; total: number }> {
    return this.sessionRepository.findPaginated(filters);
  }
}
