import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { cohortsApi, type RosterStudent } from '@/api/cohorts.api';
import { teamsApi } from '@/api/teams.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users2, Plus, GripVertical, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Team } from '@/types';

function refId(v: any): string {
  if (!v) return '';
  if (typeof v === 'string') return v;
  return v.id || v._id || '';
}

function initials(name?: string) {
  if (!name) return '?';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

/**
 * Instructor team-formation board: an "Unassigned" pool plus one column per
 * team. Drag students to assign/move them. Token-based so it respects the
 * light/dark theme. Native HTML5 drag-and-drop — no extra dependency.
 */
export function TeamBoard({ cohortId }: { cohortId: string }) {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['cohort-roster', cohortId],
    queryFn: async () => (await cohortsApi.getRoster(cohortId)).data.data,
    enabled: !!cohortId,
  });

  const [dragging, setDragging] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [creating, setCreating] = useState(false);

  const students = data?.students || [];
  const teams = data?.teams || [];

  const memberTeam = useMemo(() => {
    const map = new Map<string, string>();
    for (const t of teams) for (const m of t.memberIds || []) map.set(refId(m), t.id);
    return map;
  }, [teams]);

  const unassigned = students.filter((s) => !memberTeam.has(s.id));
  const refresh = () => queryClient.invalidateQueries({ queryKey: ['cohort-roster', cohortId] });

  const moveStudent = async (studentId: string, targetTeamId: string | null) => {
    const currentTeamId = memberTeam.get(studentId) || null;
    if (currentTeamId === targetTeamId) return;
    setBusy(true);
    try {
      if (currentTeamId) await teamsApi.removeMember(currentTeamId, studentId);
      if (targetTeamId) await teamsApi.addMember(targetTeamId, studentId);
      await refresh();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to move student');
    } finally {
      setBusy(false);
      setDragging(null);
    }
  };

  const handleCreateTeam = async () => {
    const name = newTeamName.trim();
    if (name.length < 2) {
      toast.error('Team name must be at least 2 characters');
      return;
    }
    setCreating(true);
    try {
      const teamCode = `${name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase() || 'TEAM'}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
      await teamsApi.create({ cohortId, name, teamCode } as Partial<Team> & { cohortId: string; name: string; teamCode: string });
      setNewTeamName('');
      await refresh();
      toast.success(`Team "${name}" created`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create team');
    } finally {
      setCreating(false);
    }
  };

  if (isLoading) return <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading roster…</div>;
  if (isError) return <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">You don't have access to this cohort's roster.</div>;

  const StudentCard = ({ student }: { student: RosterStudent }) => (
    <div
      draggable
      onDragStart={() => setDragging(student.id)}
      onDragEnd={() => setDragging(null)}
      className={`flex cursor-grab items-center gap-2 rounded-lg border border-border bg-card p-2 active:cursor-grabbing ${
        dragging === student.id ? 'opacity-40' : ''
      }`}
    >
      <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
      {student.avatar ? (
        <img src={student.avatar} alt="" className="h-7 w-7 rounded-full object-cover" />
      ) : (
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
          {initials(student.name)}
        </span>
      )}
      <span className="truncate text-xs font-medium text-foreground">{student.name}</span>
    </div>
  );

  const Column = ({ title, subtitle, onDrop, accent, children, count }: {
    title: string; subtitle?: string; onDrop: () => void; accent: string; children: React.ReactNode; count: number;
  }) => (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); onDrop(); }}
      className={`flex w-64 shrink-0 flex-col rounded-xl border ${accent} bg-muted/30`}
    >
      <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-foreground">{title}</p>
          {subtitle && <p className="truncate text-[10px] text-muted-foreground">{subtitle}</p>}
        </div>
        <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">{count}</span>
      </div>
      <div className="min-h-[120px] flex-1 space-y-2 p-2">{children}</div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="New team name…"
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreateTeam()}
          className="max-w-xs"
        />
        <Button onClick={handleCreateTeam} disabled={creating}>
          <Plus className="mr-1.5 h-4 w-4" /> Create Team
        </Button>
        {busy && <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…</span>}
        <span className="ml-auto text-xs text-muted-foreground">Drag students between the pool and teams.</span>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        <Column
          title="Unassigned Pool"
          subtitle={`${students.length} students in cohort`}
          count={unassigned.length}
          accent="border-border"
          onDrop={() => dragging && moveStudent(dragging, null)}
        >
          {unassigned.length === 0 ? (
            <p className="py-6 text-center text-xs italic text-muted-foreground">Everyone is assigned 🎉</p>
          ) : (
            unassigned.map((s) => <StudentCard key={s.id} student={s} />)
          )}
        </Column>

        {teams.map((team) => {
          const members = (team.memberIds || [])
            .map((m) => {
              const id = refId(m);
              return students.find((s) => s.id === id) || (typeof m === 'object' ? { id, name: (m as any).name, avatar: (m as any).avatar } : { id, name: id });
            })
            .filter(Boolean) as RosterStudent[];
          return (
            <Column
              key={team.id}
              title={team.name}
              subtitle={team.teamCode}
              count={members.length}
              accent="border-primary/25"
              onDrop={() => dragging && moveStudent(dragging, team.id)}
            >
              {members.length === 0 ? (
                <p className="py-6 text-center text-xs italic text-muted-foreground">Drop students here</p>
              ) : (
                members.map((s) => <StudentCard key={s.id} student={s} />)
              )}
            </Column>
          );
        })}

        {teams.length === 0 && (
          <div className="flex w-64 shrink-0 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center">
            <Users2 className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">No teams yet. Create one to start assigning students.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeamBoard;
