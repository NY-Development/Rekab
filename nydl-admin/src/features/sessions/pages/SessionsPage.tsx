import { useSessions, useSessionMutations } from '@/hooks/useSessions';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ColumnDef } from '@tanstack/react-table';
import { Session } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Trash, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export function SessionsPage() {
  const { data, isLoading } = useSessions();
  const { deleteSession } = useSessionMutations();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this session?')) return;
    try {
      await deleteSession(id);
      toast.success('Session deleted successfully');
    } catch {
      toast.error('Failed to delete session');
    }
  };

  const columns: ColumnDef<Session>[] = [
    { accessorKey: 'title', header: 'Session Title', cell: (info) => <span className="font-bold text-white">{info.getValue() as string}</span> },
    { accessorKey: 'cohort.name', header: 'Cohort', cell: (info) => <span>{info.row.original.cohort?.name || 'N/A'}</span> },
    { accessorKey: 'type', header: 'Type' },
    {
      accessorKey: 'scheduledAt',
      header: 'Scheduled At',
      cell: (info) => <span>{new Date(info.getValue() as string).toLocaleString()}</span>,
    },
    { accessorKey: 'status', header: 'Status', cell: (info) => <StatusBadge status={info.getValue() as string} /> },
    {
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex gap-2">
          {info.row.original.meetLink && (
            <a
              href={info.row.original.meetLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 h-8 w-8 transition-colors"
              title="Open Live Meet"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
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
          <h1 className="text-xl font-bold text-white uppercase tracking-wider">Live Sessions</h1>
          <p className="text-sm text-slate-400 font-medium">Schedule online classroom video lectures, distribute meet links, and control streaming records.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
          <Plus className="mr-2 h-4 w-4" /> Schedule Session
        </Button>
      </div>

      {isLoading ? (
        <div className="text-slate-400">Loading session timelines...</div>
      ) : (
        <DataTable columns={columns} data={data?.docs || []} pageCount={data?.totalPages || 1} />
      )}
    </div>
  );
}

export default SessionsPage;
