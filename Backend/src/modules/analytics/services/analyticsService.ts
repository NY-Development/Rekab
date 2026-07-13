import { AnalyticsRepository } from '../repositories/analyticsRepository';
import { CreateActivityLogDto, LogStudentActivityDto } from '../dtos/analyticsDto';
import { ActivityLog, StudentActivity } from '../../../types';

export class AnalyticsService {
  constructor(private analyticsRepository: AnalyticsRepository) {}

  async createActivityLog(data: CreateActivityLogDto): Promise<ActivityLog> {
    return this.analyticsRepository.createActivityLog(data);
  }

  async getActivityLogs(filters: {
    page: number;
    limit: number;
    userId?: string;
    action?: string;
    search?: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<{ docs: ActivityLog[]; total: number }> {
    return this.analyticsRepository.findActivityLogs(filters);
  }

  async logStudentActivity(studentId: string, data: LogStudentActivityDto): Promise<StudentActivity> {
    const payload = {
      studentId,
      action: data.action,
      metadata: data.metadata,
    };
    return this.analyticsRepository.createStudentActivity(payload);
  }

  async getStudentActivities(filters: {
    page: number;
    limit: number;
    studentId?: string;
    action?: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<{ docs: StudentActivity[]; total: number }> {
    return this.analyticsRepository.findStudentActivities(filters);
  }

  async getSummary() {
    return this.analyticsRepository.getSummary();
  }

  async getEnrollmentTrends(months: number) {
    return this.analyticsRepository.getEnrollmentTrends(months);
  }

  async getRevenueTrends(months: number) {
    return this.analyticsRepository.getRevenueTrends(months);
  }
}
