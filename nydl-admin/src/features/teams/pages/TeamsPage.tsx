import { useTeams, useTeamMutations } from '@/hooks/useTeams';
import { DataTable } from '@/components/common/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Team } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Trash, Users2 } from 'lucide-react';
import { toast } from 'sonner';

export function TeamsPage() {
  const { data, isLoading } = useTeams();
  const { deleteTeam } = useTeamMutations();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team?')) return;
    try {
      await deleteTeam(id);
      toast.success('Team deleted successfully');
    } catch {
      toast.error('Failed to delete team');
    }
  };

  const columns: ColumnDef<Team>[] = [
    { accessorKey: 'name', header: 'Team Name', cell: (info) => <span className="font-bold text-white">{info.getValue() as string}</span> },
    { accessorKey: 'cohort.name', header: 'Cohort', cell: (info) => <span>{info.row.original.cohort?.name || 'N/A'}</span> },
    {
      accessorKey: 'memberIds',
      header: 'Members',
      cell: (info) => {
        const list = info.getValue() as string[];
        return <span className="font-semibold text-slate-300">{list?.length || 0} students</span>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(info.row.original.id)}
            className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 h-8 w-8"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white uppercase tracking-wider">Team Structures</h1>
          <p className="text-sm text-slate-400 font-medium">Control research project teams, leaders, member list rosters, and assigned mentors.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
          <Plus className="mr-2 h-4 w-4" /> Create Team
        </Button>
      </div>

      {isLoading ? (
        <div className="text-slate-400">Loading team rosters...</div>
      ) : (
        <DataTable columns={columns} data={data?.docs || []} pageCount={data?.totalPages || 1} />
      )}
    </div>
  );
}

export default TeamsPage;
