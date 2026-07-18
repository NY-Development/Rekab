import { useEnrollments } from '@/hooks/useEnrollments';
import { useStudentProfile } from '@/hooks/useProfile';
import { Card, CardContent } from '@/components/ui/card';
import { Award, BookOpen, Clock, Activity } from 'lucide-react';

/** Enrollments come back with courseId populated ({ title, code, ... }). */
function courseTitle(courseId: unknown): string {
  if (courseId && typeof courseId === 'object') {
    const c = courseId as { title?: string; code?: string };
    return c.title || c.code || 'Course';
  }
  return typeof courseId === 'string' ? courseId : 'Course';
}

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  COMPLETED: 'bg-primary/10 text-primary',
  PENDING: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  PENDING_APPROVAL: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  REJECTED: 'bg-destructive/10 text-destructive',
  SUSPENDED: 'bg-destructive/10 text-destructive',
};

export default function ProgressPage() {
  const { data: profileRes, isLoading: isProfileLoading } = useStudentProfile();
  const { data: enrollmentsRes, isLoading: isEnrollmentsLoading } = useEnrollments();

  const profile = profileRes?.data as any;
  const enrollments = (enrollmentsRes?.data || []) as any[];

  const completedCount = enrollments.filter((e) => String(e.status).toUpperCase() === 'COMPLETED').length;
  const activeCount = enrollments.filter((e) => String(e.status).toUpperCase() === 'ACTIVE').length;
  const avgProgress = enrollments.length
    ? Math.round(enrollments.reduce((sum, e) => sum + (e.progressPercentage || 0), 0) / enrollments.length)
    : 0;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-10">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">Academic Progress</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Track your course completions, performance, and learning stats.
        </p>
      </div>

      {isProfileLoading || isEnrollmentsLoading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Key metrics */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <Card>
              <CardContent className="flex items-center justify-between pt-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Enrolled</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{enrollments.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-primary opacity-80" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between pt-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Active</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{activeCount}</p>
                </div>
                <Activity className="h-8 w-8 text-primary opacity-80" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between pt-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Completed</p>
                  <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{completedCount}</p>
                </div>
                <Award className="h-8 w-8 text-emerald-600 opacity-80 dark:text-emerald-400" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between pt-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Avg Progress</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{avgProgress}%</p>
                </div>
                <Clock className="h-8 w-8 text-muted-foreground opacity-85" />
              </CardContent>
            </Card>
          </div>

          {/* Course breakdown */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-foreground">Course Breakdown</h3>
            {enrollments.length === 0 ? (
              <div className="rounded-lg border border-border bg-card p-10 text-center text-muted-foreground">
                You haven't registered for any courses yet.
              </div>
            ) : (
              <div className="space-y-4">
                {enrollments.map((enr) => {
                  const status = String(enr.status).toUpperCase();
                  const badge = STATUS_STYLES[status] || 'bg-muted text-muted-foreground';
                  return (
                    <div
                      key={enr.id}
                      className="flex flex-col items-start justify-between gap-4 rounded-lg border border-border bg-card p-6 sm:flex-row sm:items-center"
                    >
                      <div className="space-y-1">
                        <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${badge}`}>
                          {status.replace('_', ' ')}
                        </span>
                        <h4 className="text-base font-bold text-foreground">{courseTitle(enr.courseId)}</h4>
                        <p className="text-xs text-muted-foreground">
                          Registered {new Date(enr.enrolledAt || enr.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {status === 'ACTIVE' && (
                        <div className="w-full space-y-1 sm:w-60">
                          <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                            <span>Completion</span>
                            <span>{enr.progressPercentage || 0}%</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{ width: `${enr.progressPercentage || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {profile?.assignmentAverage != null && (
            <p className="text-xs text-muted-foreground">
              Assignment average: <span className="font-semibold text-foreground">{profile.assignmentAverage}%</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
