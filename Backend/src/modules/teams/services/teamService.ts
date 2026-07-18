import { TeamRepository } from '../repositories/teamRepository';
import { CreateTeamDto, UpdateTeamDto } from '../dtos/teamDto';
import { Team } from '../../../types';
import { AppError } from '../../../middlewares/errorHandler';

export class TeamService {
  constructor(private teamRepository: TeamRepository) {}

  async getTeamById(id: string): Promise<Team> {
    const team = await this.teamRepository.findById(id);
    if (!team) {
      throw new AppError('Team not found', 404);
    }
    return team;
  }

  async getCohortTeams(cohortId: string): Promise<Team[]> {
    return this.teamRepository.findByCohortId(cohortId);
  }

  /** The team the given student belongs to (or null if unassigned). */
  async getMyTeam(userId: string): Promise<Team | null> {
    const teams = await this.teamRepository.findByMemberUserId(userId);
    return teams[0] || null;
  }

  async createTeam(data: CreateTeamDto): Promise<Team> {
    const existing = await this.teamRepository.findByTeamCode(data.teamCode);
    if (existing) {
      throw new AppError('Team code is already in use', 409);
    }
    return this.teamRepository.create(data);
  }

  async updateTeam(id: string, updateData: UpdateTeamDto): Promise<Team> {
    const team = await this.teamRepository.findById(id);
    if (!team) {
      throw new AppError('Team not found', 404);
    }
    const updated = await this.teamRepository.update(id, updateData);
    if (!updated) {
      throw new AppError('Failed to update team', 500);
    }
    return updated;
  }

  async deleteTeam(id: string): Promise<void> {
    const team = await this.teamRepository.findById(id);
    if (!team) {
      throw new AppError('Team not found', 404);
    }
    const deleted = await this.teamRepository.delete(id);
    if (!deleted) {
      throw new AppError('Failed to delete team', 500);
    }
  }

  async addMember(id: string, userId: string): Promise<Team> {
    const team = await this.teamRepository.findById(id);
    if (!team) {
      throw new AppError('Team not found', 404);
    }

    // Safely default to empty array
    const memberIds = team.memberIds ?? [];

    if (memberIds.map(mid => mid.toString()).includes(userId)) {
      throw new AppError('User is already a member of this team', 409);
    }

    // Safely default maxMembers to 0 if undefined
    if (memberIds.length >= (team.maxMembers ?? 0)) {
      throw new AppError('Team has reached maximum capacity', 400);
    }

    const updatedMemberIds = [...memberIds, userId];
    const updated = await this.teamRepository.update(id, { memberIds: updatedMemberIds });
    if (!updated) {
      throw new AppError('Failed to add team member', 500);
    }
    return updated;
  }

  async removeMember(id: string, userId: string): Promise<Team> {
    const team = await this.teamRepository.findById(id);
    if (!team) {
      throw new AppError('Team not found', 404);
    }

    // Safely default to empty array
    const memberIds = team.memberIds ?? [];

    if (!memberIds.map(mid => mid.toString()).includes(userId)) {
      throw new AppError('User is not a member of this team', 404);
    }

    const updatedMemberIds = memberIds.filter(mid => mid.toString() !== userId);
    const updated = await this.teamRepository.update(id, { memberIds: updatedMemberIds });
    if (!updated) {
      throw new AppError('Failed to remove team member', 500);
    }
    return updated;
  }

  async listTeams(filters: {
    page: number;
    limit: number;
    search?: string;
    cohortId?: string;
    mentorId?: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<{ docs: Team[]; total: number }> {
    return this.teamRepository.findPaginated(filters);
  }
}