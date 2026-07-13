import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  BookOpen, Video, Calendar, AlertTriangle, CheckCircle, Megaphone
} from 'lucide-react';
import { useEnrollments } from '@/hooks/useEnrollments';
import { profileApi } from '@/api/profile.api';
import { sessionsApi } from '@/api/sessions.api';
import { announcementsApi } from '@/api/announcements.api';
import { assignmentsApi } from '@/api/assignments.api';
import { useAuthStore } from '@/store/auth.store';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { user } = useAuthStore();

  // Queries
  const { data: profileRes, isLoading: isProfileLoading } = useQuery({
    queryKey: ['studentProfile'],
    queryFn: () => profileApi.getStudentProfile().then((res) => res.data),
  });

  const { data: enrollmentsRes, isLoading: isEnrollmentsLoading } = useEnrollments();

  const { data: sessionsRes } = useQuery({
    queryKey: ['mySessions'],
    queryFn: () => sessionsApi.getAll({ limit: 1, status: 'SCHEDULED' }).then((res) => res.data),
  });

  const { data: announcementsRes } = useQuery({
    queryKey: ['myAnnouncements'],
    queryFn: () => announcementsApi.getAll({ limit: 2 }).then((res) => res.data),
  });

  const { data: assignmentsRes } = useQuery({
    queryKey: ['myAssignments'],
    queryFn: () => assignmentsApi.getAll({ limit: 3 }).then((res) => res.data),
  });

  const studentProfile = profileRes?.data;
  const myEnrollments = enrollmentsRes?.data || [];
  const activeEnrollment = myEnrollments.find((e) => e.status === 'ACTIVE') || myEnrollments[0];
  const nextSession = sessionsRes?.data?.docs?.[0];
  const announcements = announcementsRes?.data?.docs || [];
  const assignments = assignmentsRes?.data?.docs || [];

  const handleJoinMeet = (url?: string) => {
    if (!url) {
      toast.error('Google Meet link is not set yet. Please check back later.');
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const isLoading = isProfileLoading || isEnrollmentsLoading;

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ─── Header ─── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Welcome back, {user?.name.split(' ')[0] || 'Student'}.</h2>
          <p className="text-muted-foreground mt-1">Here's your high-level overview for today.</p>
        </div>
        <div className="sm:text-right">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Current Status</p>
          <p className="text-xl font-bold text-primary">{studentProfile?.graduationStatus || 'Active Learner'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* ─── Left — Cohort Info (8 columns) ─── */}
        <div className="lg:col-span-8 space-y-6">
          {activeEnrollment ? (
            <Card className="hover:shadow-sm transition-shadow duration-200">
              <CardHeader className="flex flex-row items-start justify-between pb-4">
                <div>
                  <Badge variant="secondary" className="mb-2 uppercase tracking-wide text-[10px] font-bold bg-primary/10 text-primary">
                    Active Cohort
                  </Badge>
                  <CardTitle className="text-2xl font-bold text-foreground">
                    Full-Stack Software Development
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    Level: {studentProfile?.currentLevel || 'Intermediate-II'}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-2">
                {/* Progress */}
                <div className="bg-muted/30 rounded-xl p-4 border border-border">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">COURSE PROGRESS</p>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-2xl font-bold text-primary">{activeEnrollment.progressPercentage || 0}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${activeEnrollment.progressPercentage || 0}%` }} />
                  </div>
                </div>

                {/* Attendance */}
                <div className="bg-muted/30 rounded-xl p-4 border border-border">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">ATTENDANCE AVERAGE</p>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-2xl font-bold text-foreground">{studentProfile?.attendanceAverage ?? 100}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${studentProfile?.attendanceAverage ?? 105}%` }} />
                  </div>
                </div>

                {/* Assignments */}
                <div className="bg-muted/30 rounded-xl p-4 border border-border">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">HEALTH SCORE</p>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-2xl font-bold text-foreground">{studentProfile?.healthScore ?? 100}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${studentProfile?.healthScore ?? 100}%` }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="p-8 text-center flex flex-col items-center justify-center border-dashed">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="mb-2">No Active Enrollments</CardTitle>
              <p className="text-muted-foreground text-sm max-w-sm mb-6">
                You are currently not enrolled in any upcoming or active cohorts. Head over to our catalog to apply.
              </p>
              <Link to="/courses" className={buttonVariants({ variant: 'default' })}>
                Browse Catalog
              </Link>
            </Card>
          )}

          {/* Pending Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" /> Pending Action Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              {assignments.length > 0 ? (
                <ul className="space-y-4">
                  {assignments.map((assignment) => (
                    <li key={assignment.id} className="flex items-start gap-3 border-b border-border/40 pb-4 last:border-b-0 last:pb-0">
                      <div className="w-8 h-8 rounded bg-amber-100 dark:bg-amber-990/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">{assignment.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Link to={`/assignments`} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                        Submit
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6 text-sm text-muted-foreground">
                  <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                  All caught up! No pending assignments due.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ─── Right — Side Widgets (4 columns) ─── */}
        <div className="lg:col-span-4 space-y-6">
          {/* Upcoming Session */}
          <Card className="relative overflow-hidden hover:shadow-sm transition-shadow duration-200">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full pointer-events-none" />
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" /> Upcoming Live Session
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col pt-2 bg-linear-to-b from-transparent to-muted/20">
              {nextSession ? (
                <>
                  <div className="text-center py-4 border-b border-border/40 mb-4">
                    <p className="text-3xl font-extrabold text-foreground">
                      {new Date(nextSession.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Date: {new Date(nextSession.scheduledAt).toLocaleDateString()} ({nextSession.duration} mins)
                    </p>
                  </div>
                  <div className="bg-background px-3 py-2.5 rounded-lg border border-border/60 mb-4">
                    <p className="text-xs font-bold text-foreground mb-0.5 truncate">{nextSession.title}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{nextSession.description || 'Lecture Session'}</p>
                  </div>
                  <Button
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => handleJoinMeet(nextSession.meetLink)}
                  >
                    <Video className="h-4 w-4" /> Join Google Meet
                  </Button>
                </>
              ) : (
                <div className="text-center py-8 text-sm text-muted-foreground flex flex-col items-center">
                  <Video className="h-8 w-8 text-muted-foreground/45 mb-2" />
                  No live sessions scheduled.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Announcements */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-rose-500" /> Announcements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {announcements.length > 0 ? (
                <div className="space-y-3">
                  {announcements.map((ann) => (
                    <div key={ann.id} className="p-3 bg-muted/40 rounded-lg border border-border border-l-4 border-l-primary">
                      <div className="flex justify-between items-center mb-1">
                        <Badge variant="outline" className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0">
                          {ann.priority}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(ann.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-semibold text-xs text-foreground">{ann.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {ann.content}
                      </p>
                    </div>
                  ))}
                  <Link to="/announcements" className={buttonVariants({ variant: 'link', size: 'sm', className: 'w-full text-xs' })}>
                    View all announcements
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-muted-foreground">
                  No announcements published yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
