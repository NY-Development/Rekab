import { DBStore } from '../../../services/dbStore';
import { isMongoConnected } from '../../../configs/db';
import UserModel from '../../users/models/User';
import CourseModel from '../../courses/models/Course';
import CohortModel from '../../cohorts/models/Cohort';
import EnrollmentModel from '../../enrollments/models/Enrollment';
import SubmissionModel from '../../submissions/models/Submission';
import ActivityLogModel from '../../analytics/models/ActivityLog';
import { User, Course, Cohort, Enrollment, Submission, ActivityLog } from '../../../types';

const UserM = UserModel as any;
const CourseM = CourseModel as any;
const CohortM = CohortModel as any;
const EnrollmentM = EnrollmentModel as any;
const SubmissionM = SubmissionModel as any;
const ActivityLogM = ActivityLogModel as any;

export class AdminRepository {
  async getActivityLogs(): Promise<ActivityLog[]> {
    if (isMongoConnected) {
      const docs = await ActivityLogM.find({}).sort({ timestamp: -1 });
      return docs.map((d: any) => d.toJSON() as ActivityLog);
    }
    return DBStore.getActivityLogs();
  }

  async getAllDataForStats(): Promise<{
    users: User[];
    courses: Course[];
    cohorts: Cohort[];
    enrollments: Enrollment[];
    submissions: Submission[];
  }> {
    if (isMongoConnected) {
      const users = await UserM.find({});
      const courses = await CourseM.find({});
      const cohorts = await CohortM.find({});
      const enrollments = await EnrollmentM.find({});
      const submissions = await SubmissionM.find({});

      return {
        users: users.map((u: any) => u.toJSON() as User),
        courses: courses.map((c: any) => c.toJSON() as Course),
        cohorts: cohorts.map((c: any) => c.toJSON() as Cohort),
        enrollments: enrollments.map((e: any) => e.toJSON() as Enrollment),
        submissions: submissions.map((s: any) => s.toJSON() as Submission),
      };
    }

    return {
      users: await DBStore.getUsers(),
      courses: await DBStore.getCourses(),
      cohorts: await DBStore.getCohorts(),
      enrollments: await DBStore.getEnrollments(),
      submissions: await DBStore.getSubmissions(),
    };
  }
}
