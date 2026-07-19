import { useState } from 'react';
import { useMyTeam } from '@/hooks/useTeams';
import { useCohorts } from '@/hooks/useCohorts';
import { useAuthStore } from '@/store/auth.store';
import { isStaffRole } from '@/lib/permissions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TeamBoard } from '../components/TeamBoard';
import { Users2, Award, ShieldAlert, GraduationCap, UserCog } from 'lucide-react';
import type { Team, TeamMemberRef } from '@/types';

/** Instructor/admin view: pick an assigned cohort and drag students into teams. */
function StaffTeamManager() {
  const { user } = useAuthStore();
  const { data: cohortsRes } = useCohorts();
  const [cohortId, setCohortId] = useState('');

  const allCohorts = cohortsRes?.data?.docs || [];
  const isAdmin = (user?.role || '').toUpperCase().includes('ADMIN');
  // Instructors only manage cohorts they're assigned to; admins see all.
  const cohorts = isAdmin
    ? allCohorts
    : allCohorts.filter((c) => (c.instructors || []).includes(user?.id || ''));

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-10">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">Team Formation</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Pick a cohort, then drag students between the pool and teams to form project groups.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Cohort</span>
        <Select value={cohortId} onValueChange={(v) => setCohortId(v ?? '')}>
          <SelectTrigger className="w-72"><SelectValue placeholder="Select a cohort" /></SelectTrigger>
          <SelectContent>
            {cohorts.length === 0 ? (
              <div className="px-3 py-2 text-xs text-muted-foreground">No cohorts assigned to you yet.</div>
            ) : (
              cohorts.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {cohortId ? (
        <TeamBoard cohortId={cohortId} />
      ) : (
        <p className="py-10 text-center text-sm text-muted-foreground">Select a cohort above to begin forming teams.</p>
      )}
    </div>
  );
}

/** Reads a possibly-populated ref into a stable display shape. */
function asMember(ref: string | TeamMemberRef | undefined): TeamMemberRef | null {
  if (!ref) return null;
  if (typeof ref === 'string') return { id: ref };
  return ref;
}

function initials(name?: string, fallback = '?') {
  if (!name) return fallback;
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function TeamPage() {
  const { user } = useAuthStore();

  // Instructors and admins get the team-formation board; students see their own team.
  if (isStaffRole(user?.role)) {
    return <StaffTeamManager />;
  }

  return <MyTeamView />;
}

function MyTeamView() {
  const { data: teamRes, isLoading, error } = useMyTeam();
  const { user } = useAuthStore();

  const team = teamRes?.data as Team | null | undefined;

  const leader = asMember(team?.leaderId);
  const mentor = asMember(team?.mentorId);
  const members = (team?.memberIds || []).map(asMember).filter((m): m is TeamMemberRef => !!m);
  const cohort = team && typeof team.cohortId === 'object' ? team.cohortId : null;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-10">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">My Team</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Collaborate, coordinate assignments, and build together with your project group.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load your team. Please try again shortly.
        </div>
      ) : !team ? (
        <div className="mx-auto max-w-md rounded-lg border border-border bg-card p-12 text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-muted">
            <Users2 className="size-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-semibold text-foreground">You're not in a team yet</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Teams are small project groups your instructor forms within your cohort. Once you're assigned, your
            teammates will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Main */}
          <div className="space-y-6 lg:col-span-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-3">
                <div>
                  <CardTitle className="text-xl font-bold text-foreground">{team.name}</CardTitle>
                  <CardDescription className="mt-1 text-xs">
                    {team.teamCode ? `Team ${team.teamCode}` : 'Project group'}
                    {cohort?.name ? ` · ${cohort.name}` : ''}
                  </CardDescription>
                </div>
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users2 className="size-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div>
                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Team Members ({members.length})
                  </h4>
                  {members.length === 0 ? (
                    <p className="text-xs italic text-muted-foreground">No members assigned yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {members.map((m) => {
                        const isLeader = leader?.id === m.id;
                        const isYou = user?.id === m.id;
                        return (
                          <div
                            key={m.id}
                            className="flex items-center gap-3 rounded-md border border-border bg-muted/40 p-3"
                          >
                            {m.avatar ? (
                              <img src={m.avatar} alt={m.name} className="size-9 rounded-full object-cover" />
                            ) : (
                              <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold uppercase text-primary">
                                {initials(m.name)}
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-foreground">
                                {m.name || 'Member'} {isYou && <span className="text-muted-foreground">(you)</span>}
                              </p>
                              {isLeader && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary">
                                  <Award className="size-3" /> Team Leader
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-4">
            <div className="space-y-4 rounded-lg border border-border bg-card p-6">
              <h4 className="text-sm font-semibold text-foreground">Team Details</h4>
              <div className="space-y-3 text-xs">
                {cohort && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GraduationCap className="size-4 text-primary" />
                    <span className="text-foreground">{cohort.name || cohort.code}</span>
                  </div>
                )}
                {mentor && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <UserCog className="size-4 text-primary" />
                    <span>
                      Instructor: <span className="text-foreground">{mentor.name || 'Assigned'}</span>
                    </span>
                  </div>
                )}
                {typeof team.score === 'number' && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Award className="size-4 text-primary" />
                    <span>
                      Team score: <span className="font-semibold text-foreground">{team.score}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 rounded-lg border border-border bg-card p-6">
              <div className="flex items-center gap-2 text-primary">
                <ShieldAlert className="size-5" />
                <h4 className="text-sm font-semibold">Collaboration Guidelines</h4>
              </div>
              <ul className="list-disc space-y-2 pl-4 text-xs text-muted-foreground">
                <li>Respect every teammate and keep debates constructive.</li>
                <li>Coordinate team assignments through your Team Leader.</li>
                <li>Raise any collaboration issues with your instructor early.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
