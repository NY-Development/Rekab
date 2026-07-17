import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Video, Megaphone, ClipboardList, Users, FolderOpen, ArrowRight } from 'lucide-react';
import { sessionsApi } from '@/api/sessions.api';
import { announcementsApi } from '@/api/announcements.api';
import { useAuthStore } from '@/store/auth.store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { UserRole } from '@/types';

interface StaffDashboardProps {
  role: Extract<UserRole, 'INSTRUCTOR' | 'MENTOR'>;
}

/**
 * Dashboard for teaching staff. The backend scopes every list endpoint to the
 * caller's assigned cohorts/teams, so everything shown here is already
 * ownership-filtered — no student enrollment widgets, no admin widgets.
 */
export default function StaffDashboard({ role }: StaffDashboardProps) {
  const user = useAuthStore((state) => state.user);

  const { data: sessionsRes, isLoading: isSessionsLoading } = useQuery({
    queryKey: ['staffSessions'],
    queryFn: () => sessionsApi.getAll({ limit: 3, status: 'SCHEDULED' }).then((res) => res.data),
  });

  const { data: announcementsRes, isLoading: isAnnouncementsLoading } = useQuery({
    queryKey: ['staffAnnouncements'],
    queryFn: () => announcementsApi.getAll({ limit: 3 }).then((res) => res.data),
  });

  const sessions = sessionsRes?.data?.docs || [];
  const announcements = announcementsRes?.data?.docs || [];

  const quickLinks =
    role === 'INSTRUCTOR'
      ? [
          { to: '/assignments', label: 'Assignments', description: 'Create and review coursework', icon: ClipboardList },
          { to: '/sessions', label: 'Live Sessions', description: 'Schedule and run classes', icon: Video },
          { to: '/resources', label: 'Resources', description: 'Share course materials', icon: FolderOpen },
          { to: '/teams', label: 'Teams', description: 'Manage cohort teams', icon: Users },
        ]
      : [
          { to: '/teams', label: 'My Teams', description: 'Guide your assigned teams', icon: Users },
          { to: '/sessions', label: 'Sessions', description: 'Upcoming mentoring sessions', icon: Video },
          { to: '/resources', label: 'Resources', description: 'Learning materials', icon: FolderOpen },
          { to: '/announcements', label: 'Announcements', description: 'Latest platform updates', icon: Megaphone },
        ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-border/40 pb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
          </h2>
          <Badge variant="outline" className="uppercase text-[10px] tracking-wider">
            {role.toLowerCase()}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {role === 'INSTRUCTOR'
            ? 'Manage your assigned courses, cohorts, and coursework.'
            : 'Guide your assigned students and teams.'}
        </p>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map(({ to, label, description, icon: Icon }) => (
          <Link key={label} to={to}>
            <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary/40">
              <CardContent className="flex items-start gap-3 pt-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upcoming sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Video className="size-4 text-primary" /> Upcoming Sessions
            </CardTitle>
            <CardDescription>Scheduled sessions in your assigned cohorts.</CardDescription>
          </CardHeader>
          <CardContent>
            {isSessionsLoading ? (
              <p className="py-6 text-center text-sm text-muted-foreground">Loading sessions...</p>
            ) : sessions.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground border border-dashed border-border rounded-lg">
                No upcoming sessions scheduled.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {sessions.map((session: any) => (
                  <li key={session.id} className="flex items-center justify-between py-3 gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{session.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {session.sessionDate ? new Date(session.sessionDate).toLocaleString() : 'TBD'}
                      </p>
                    </div>
                    <Link to="/sessions" className="text-xs font-semibold text-primary hover:underline shrink-0 flex items-center gap-1">
                      View <ArrowRight className="size-3" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Recent announcements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Megaphone className="size-4 text-primary" /> Announcements
            </CardTitle>
            <CardDescription>Latest updates relevant to you.</CardDescription>
          </CardHeader>
          <CardContent>
            {isAnnouncementsLoading ? (
              <p className="py-6 text-center text-sm text-muted-foreground">Loading announcements...</p>
            ) : announcements.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground border border-dashed border-border rounded-lg">
                No announcements yet.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {announcements.map((announcement: any) => (
                  <li key={announcement.id} className="py-3">
                    <p className="text-sm font-semibold text-foreground">{announcement.title}</p>
                    <p className="line-clamp-2 text-xs text-muted-foreground">{announcement.content}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
