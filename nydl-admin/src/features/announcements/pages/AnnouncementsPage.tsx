import { useAnnouncements, useAnnouncementMutations } from '@/hooks/useAnnouncements';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ColumnDef } from '@tanstack/react-table';
import { Announcement } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Trash } from 'lucide-react';
import { toast } from 'sonner';

export function AnnouncementsPage() {
  const { data, isLoading } = useAnnouncements();
  const { deleteAnnouncement } = useAnnouncementMutations();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await deleteAnnouncement(id);
      toast.success('Announcement deleted successfully');
    } catch {
      toast.error('Failed to delete announcement');
    }
  };

  const columns: ColumnDef<Announcement>[] = [
    { accessorKey: 'title', header: 'Title', cell: (info) => <span className="font-bold text-white">{info.getValue() as string}</span> },
    { accessorKey: 'priority', header: 'Priority', cell: (info) => <StatusBadge status={info.getValue() as string} /> },
    { accessorKey: 'targetScope', header: 'Scope' },
    {
      accessorKey: 'createdAt',
      header: 'Posted Date',
      cell: (info) => <span>{new Date(info.getValue() as string).toLocaleDateString()}</span>,
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
          <h1 className="text-xl font-bold text-white uppercase tracking-wider">Announcements Feed</h1>
          <p className="text-sm text-slate-400 font-medium">Broadcast news banners, warnings, updates, and schedule bulletins to scopes.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
          <Plus className="mr-2 h-4 w-4" /> Create Broadcast
        </Button>
      </div>

      {isLoading ? (
        <div className="text-slate-400">Loading broadcasts...</div>
      ) : (
        <DataTable columns={columns} data={data?.docs || []} pageCount={data?.totalPages || 1} />
      )}
    </div>
  );
}

export default AnnouncementsPage;
