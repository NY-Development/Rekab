import { useState } from 'react';
import { useTeams, useTeamMutations } from '@/hooks/useTeams';
import { useCohorts } from '@/hooks/useCohorts';
import { DataTable } from '@/components/common/DataTable';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { TeamBoard } from '../components/TeamBoard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ColumnDef } from '@tanstack/react-table';
import { Team } from '@/types';
import { getPopulated } from '@/utils/registration';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';

export function TeamsPage() {
  const { data, isLoading, isError } = useTeams({ limit: 100 });
  const { deleteTeam } = useTeamMutations();
  const { data: cohortsData } = useCohorts({ limit: 100 });
  const cohorts = cohortsData?.docs || [];
  const [cohortId, setCohortId] = useState('');

  const handleDelete = async (id: string) => {
    try {
      await deleteTeam(id);
      toast.success('Team deleted successfully');
    } catch {
      toast.error('Failed to delete team');
    }
  };

  const columns: ColumnDef<Team>[] = [
    { accessorKey: 'name', header: 'Team Name', cell: (info) => <span className="font-bold text-white">{info.getValue() as string}</span> },
    { id: 'cohort', header: 'Cohort', cell: (info) => <span>{getPopulated(info.row.original.cohortId)?.name || 'N/A'}</span> },
    {
      accessorKey: 'memberIds',
      header: 'Members',
      cell: (info) => {
        const list = info.getValue() as unknown[];
        return <span className="font-semibold text-slate-300">{list?.length || 0} students</span>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex gap-2">
          <ConfirmDialog
            trigger={
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 h-8 w-8" />
            }
            title="Delete Team?"
            description="This action cannot be undone. The team and its member assignments will be permanently removed."
            onConfirm={() => handleDelete(info.row.original.id)}
          >
            <Trash className="h-4 w-4" />
          </ConfirmDialog>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold uppercase tracking-wider text-white">Team Formation</h1>
        <p className="text-sm font-medium text-slate-400">
          Pick a cohort, then drag students between the pool and teams to form project groups.
        </p>
      </div>

      {/* ─── Drag-and-drop board ─── */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-5">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">Cohort</span>
          <Select value={cohortId} onValueChange={(v) => setCohortId(v ?? '')}>
            <SelectTrigger className="w-72 border-slate-700 bg-slate-900 text-white">
              <SelectValue placeholder="Select a cohort to manage teams" />
            </SelectTrigger>
            <SelectContent className="border-slate-700 bg-slate-900 text-white">
              {cohorts.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name} {getPopulated(c.courseId)?.title ? `· ${getPopulated(c.courseId)?.title}` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {cohortId ? (
          <TeamBoard cohortId={cohortId} />
        ) : (
          <p className="py-10 text-center text-sm text-slate-500">Select a cohort above to begin forming teams.</p>
        )}
      </div>

      {/* ─── All teams overview ─── */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">All Teams</h2>
        {isLoading ? (
          <div className="text-slate-400">Loading team rosters...</div>
        ) : isError ? (
          <div className="text-rose-400">Failed to load teams. Please try again later.</div>
        ) : (
          <DataTable columns={columns} data={data?.docs || []} pageCount={data?.totalPages || 1} />
        )}
      </div>
    </div>
  );
}

export default TeamsPage;
