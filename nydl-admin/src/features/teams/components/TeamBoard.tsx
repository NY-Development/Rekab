import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { cohortsApi, type RosterStudent } from '@/api/cohorts.api';
import { teamsApi } from '@/api/teams.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users2, Plus, GripVertical, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Team } from '@/types';

/** Extracts a raw id from a possibly-populated ref. */
function refId(v: any): string {
  if (!v) return '';
  if (typeof v === 'string') return v;
  return v.id || v._id || '';
}

function initials(name?: string) {
  if (!name) return '?';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

interface TeamBoardProps {
  cohortId: string;
}

/**
 * Drag-and-drop team formation board: an "Unassigned" pool plus one column per
 * team. Dragging a student assigns/moves them (add to target team, remove from
 * their previous team). Uses native HTML5 DnD — no extra dependency.
 */
export function TeamBoard({ cohortId }: TeamBoardProps) {
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

  // Map each student -> the team they currently belong to (if any).
  const memberTeam = useMemo(() => {
    const map = new Map<string, string>();
    for (const t of teams) {
      for (const m of t.memberIds || []) map.set(refId(m), t.id);
    }
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
      await teamsApi.create({ cohortId, name, teamCode } as Partial<Team>);
      setNewTeamName('');
      await refresh();
      toast.success(`Team "${name}" created`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create team');
    } finally {
      setCreating(false);
    }
  };

  if (isLoading) return <div className="flex items-center gap-2 text-slate-400"><Loader2 className="h-4 w-4 animate-spin" /> Loading roster…</div>;
  if (isError) return <div className="text-rose-400">Failed to load the cohort roster.</div>;

  const StudentCard = ({ student }: { student: RosterStudent }) => (
    <div
      draggable
      onDragStart={() => setDragging(student.id)}
      onDragEnd={() => setDragging(null)}
      className={`flex cursor-grab items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 p-2 active:cursor-grabbing ${
        dragging === student.id ? 'opacity-40' : ''
      }`}
    >
      <GripVertical className="h-4 w-4 shrink-0 text-slate-600" />
      {student.avatar ? (
        <img src={student.avatar} alt="" className="h-7 w-7 rounded-full object-cover" />
      ) : (
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/15 text-[10px] font-bold text-blue-300">
          {initials(student.name)}
        </span>
      )}
      <span className="truncate text-xs font-medium text-slate-200">{student.name}</span>
    </div>
  );

  const Column = ({
    title,
    subtitle,
    onDrop,
    accent,
    children,
    count,
  }: {
    title: string;
    subtitle?: string;
    onDrop: () => void;
    accent: string;
    children: React.ReactNode;
    count: number;
  }) => (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onDrop();
      }}
      className={`flex w-64 shrink-0 flex-col rounded-xl border ${accent} bg-slate-950`}
    >
      <div className="flex items-center justify-between border-b border-slate-800 px-3 py-2.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white">{title}</p>
          {subtitle && <p className="truncate text-[10px] text-slate-500">{subtitle}</p>}
        </div>
        <span className="shrink-0 rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300">{count}</span>
      </div>
      <div className="flex-1 space-y-2 p-2 min-h-[120px]">{children}</div>
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
          className="max-w-xs border-slate-700 bg-slate-900 text-white"
        />
        <Button onClick={handleCreateTeam} disabled={creating} className="bg-blue-600 text-white hover:bg-blue-700">
          <Plus className="mr-1.5 h-4 w-4" /> Create Team
        </Button>
        {busy && <span className="flex items-center gap-1.5 text-xs text-slate-400"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…</span>}
        <span className="ml-auto text-xs text-slate-500">Drag students between the pool and teams to assign them.</span>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        <Column
          title="Unassigned Pool"
          subtitle={`${students.length} students in cohort`}
          count={unassigned.length}
          accent="border-slate-800"
          onDrop={() => dragging && moveStudent(dragging, null)}
        >
          {unassigned.length === 0 ? (
            <p className="py-6 text-center text-xs italic text-slate-600">Everyone is assigned 🎉</p>
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
              accent="border-blue-500/20"
              onDrop={() => dragging && moveStudent(dragging, team.id)}
            >
              {members.length === 0 ? (
                <p className="py-6 text-center text-xs italic text-slate-600">Drop students here</p>
              ) : (
                members.map((s) => <StudentCard key={s.id} student={s} />)
              )}
            </Column>
          );
        })}

        {teams.length === 0 && (
          <div className="flex w-64 shrink-0 flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-950/50 p-6 text-center">
            <Users2 className="mb-2 h-8 w-8 text-slate-700" />
            <p className="text-xs text-slate-500">No teams yet. Create one to start assigning students.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeamBoard;
