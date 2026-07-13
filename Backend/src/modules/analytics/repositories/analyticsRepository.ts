import ActivityLogModel from '../models/ActivityLog';
import StudentActivityModel from '../models/StudentActivity';
import UserModel from '../../users/models/User';
import CourseModel from '../../courses/models/Course';
import CohortModel from '../../cohorts/models/Cohort';
import EnrollmentModel from '../../enrollments/models/Enrollment';
import PaymentModel from '../../payments/models/Payment';
import AttendanceModel from '../../attendance/models/Attendance';
import StudentHealthModel from '../../healthScores/models/StudentHealth';
import { ActivityLog, StudentActivity } from '../../../types';
import { isMongoConnected } from '../../../configs/db';

const ActivityLogM = ActivityLogModel as any;
const StudentActivityM = StudentActivityModel as any;
const UserM = UserModel as any;
const CourseM = CourseModel as any;
const CohortM = CohortModel as any;
const EnrollmentM = EnrollmentModel as any;
const PaymentM = PaymentModel as any;
const AttendanceM = AttendanceModel as any;
const StudentHealthM = StudentHealthModel as any;

const ACTIVE_ENROLLMENT_STATUSES = ['enrolled', 'ENROLLED', 'ACTIVE', 'APPROVED', 'PENDING'];
const COMPLETED_ENROLLMENT_STATUSES = ['completed', 'COMPLETED'];

export class AnalyticsRepository {
  // Activity Logistics
  async createActivityLog(data: Omit<ActivityLog, 'id' | 'timestamp'>): Promise<ActivityLog> {
    if (isMongoConnected) {
      const doc = await ActivityLogM.create(data);
      return doc.toJSON() as ActivityLog;
    }
    throw new Error('Database not connected');
  }

  async findActivityLogs(filters: {
    page: number;
    limit: number;
    userId?: string;
    action?: string;
    search?: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<{ docs: ActivityLog[]; total: number }> {
    if (!isMongoConnected) {
      return { docs: [], total: 0 };
    }

    const { page, limit, userId, action, search, sortBy, sortOrder } = filters;
    const query: Record<string, any> = {};

    if (userId) query.userId = userId;
    if (action) query.action = action;
    if (search) {
      query.$or = [
        { userName: { $regex: search, $options: 'i' } },
        { details: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const total = await ActivityLogM.countDocuments(query);
    const docs = await ActivityLogM.find(query)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    return {
      docs: docs.map((d: any) => d.toJSON() as ActivityLog),
      total
    };
  }

  // Student Activity logs
  async createStudentActivity(data: Omit<StudentActivity, 'id' | 'timestamp'>): Promise<StudentActivity> {
    if (isMongoConnected) {
      const doc = await StudentActivityM.create(data);
      return doc.toJSON() as StudentActivity;
    }
    throw new Error('Database not connected');
  }

  async findStudentActivities(filters: {
    page: number;
    limit: number;
    studentId?: string;
    action?: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<{ docs: StudentActivity[]; total: number }> {
    if (!isMongoConnected) {
      return { docs: [], total: 0 };
    }

    const { page, limit, studentId, action, sortBy, sortOrder } = filters;
    const query: Record<string, any> = {};

    if (studentId) query.studentId = studentId;
    if (action) query.action = action;

    const skip = (page - 1) * limit;

    const total = await StudentActivityM.countDocuments(query);
    const docs = await StudentActivityM.find(query)
      .populate('studentId', 'name email role avatar')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    return {
      docs: docs.map((d: any) => d.toJSON() as StudentActivity),
      total
    };
  }

  async getSummary(): Promise<{
    totalStudents: number;
    totalInstructors: number;
    totalMentors: number;
    totalCourses: number;
    totalCohorts: number;
    activeEnrollments: number;
    completedEnrollments: number;
    totalRevenue: number;
    averageAttendance: number;
    averageHealthScore: number;
  }> {
    if (!isMongoConnected) {
      return {
        totalStudents: 0,
        totalInstructors: 0,
        totalMentors: 0,
        totalCourses: 0,
        totalCohorts: 0,
        activeEnrollments: 0,
        completedEnrollments: 0,
        totalRevenue: 0,
        averageAttendance: 0,
        averageHealthScore: 0,
      };
    }

    const [
      totalStudents,
      totalInstructors,
      totalMentors,
      totalCourses,
      totalCohorts,
      activeEnrollments,
      completedEnrollments,
      revenueAgg,
      attendanceStats,
      healthAgg,
    ] = await Promise.all([
      UserM.countDocuments({ role: { $in: ['STUDENT', 'student'] } }),
      UserM.countDocuments({ role: { $in: ['INSTRUCTOR', 'instructor'] } }),
      UserM.countDocuments({ role: { $in: ['MENTOR', 'mentor'] } }),
      CourseM.countDocuments({}),
      CohortM.countDocuments({}),
      EnrollmentM.countDocuments({ status: { $in: ACTIVE_ENROLLMENT_STATUSES } }),
      EnrollmentM.countDocuments({ status: { $in: COMPLETED_ENROLLMENT_STATUSES } }),
      PaymentM.aggregate([
        { $match: { status: 'VERIFIED' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      AttendanceM.aggregate([
        { $group: { _id: null, total: { $sum: 1 }, present: { $sum: { $cond: [{ $eq: ['$status', 'PRESENT'] }, 1, 0] } } } },
      ]),
      StudentHealthM.aggregate([
        { $group: { _id: null, avg: { $avg: '$overallScore' } } },
      ]),
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;
    const averageAttendance = attendanceStats[0]?.total
      ? Math.round((attendanceStats[0].present / attendanceStats[0].total) * 100)
      : 0;
    const averageHealthScore = healthAgg[0]?.avg ? Math.round(healthAgg[0].avg) : 0;

    return {
      totalStudents,
      totalInstructors,
      totalMentors,
      totalCourses,
      totalCohorts,
      activeEnrollments,
      completedEnrollments,
      totalRevenue,
      averageAttendance,
      averageHealthScore,
    };
  }

  async getEnrollmentTrends(months: number): Promise<{ month: string; count: number }[]> {
    if (!isMongoConnected) {
      return [];
    }

    const since = new Date();
    since.setMonth(since.getMonth() - (months - 1));
    since.setDate(1);
    since.setHours(0, 0, 0, 0);

    const results = await EnrollmentM.aggregate([
      { $match: { createdAt: { $gte: since.toISOString() } } },
      {
        $group: {
          _id: { $substr: ['$createdAt', 0, 7] },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return results.map((r: any) => ({ month: r._id, count: r.count }));
  }

  async getRevenueTrends(months: number): Promise<{ month: string; amount: number }[]> {
    if (!isMongoConnected) {
      return [];
    }

    const since = new Date();
    since.setMonth(since.getMonth() - (months - 1));
    since.setDate(1);
    since.setHours(0, 0, 0, 0);

    const results = await PaymentM.aggregate([
      { $match: { status: 'VERIFIED', createdAt: { $gte: since.toISOString() } } },
      {
        $group: {
          _id: { $substr: ['$createdAt', 0, 7] },
          amount: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return results.map((r: any) => ({ month: r._id, amount: r.amount }));
  }
}
