import { z } from 'zod';
import { useAnnouncements, useAnnouncementMutations } from '@/hooks/useAnnouncements';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { EntityFormDialog } from '@/components/common/EntityFormDialog';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { ColumnDef } from '@tanstack/react-table';
import { Announcement } from '@/types';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';

const createAnnouncementSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(5, 'Content must be at least 5 characters'),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']),
});

export function AnnouncementsPage() {
  const { data, isLoading, isError } = useAnnouncements();
  const { createAnnouncement, deleteAnnouncement } = useAnnouncementMutations();

  const handleDelete = async (id: string) => {
    try {
      await deleteAnnouncement(id);
      toast.success('Announcement deleted successfully');
    } catch {
      toast.error('Failed to delete announcement');
    }
  };

  const handleCreate = async (values: z.infer<typeof createAnnouncementSchema>) => {
    try {
      await createAnnouncement(values);
      toast.success('Announcement published successfully');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to publish announcement');
      throw err;
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
          <ConfirmDialog
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 h-8 w-8"
              />
            }
            title="Delete Announcement?"
            description="This action cannot be undone. The announcement will be permanently removed and unpublished from all feeds."
            onConfirm={() => handleDelete(info.row.original.id)}
          >
            <Trash className="h-4 w-4" />
          </ConfirmDialog>
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
        <EntityFormDialog
          triggerLabel="Create Broadcast"
          title="Create New Announcement"
          schema={createAnnouncementSchema}
          fields={[
            { name: 'title', label: 'Title', placeholder: 'Cohort schedule update' },
            { name: 'content', label: 'Content', type: 'textarea', placeholder: 'Announcement details...' },
            {
              name: 'priority',
              label: 'Priority',
              type: 'select',
              placeholder: 'Select priority',
              options: [
                { value: 'LOW', label: 'Low' },
                { value: 'NORMAL', label: 'Normal' },
                { value: 'HIGH', label: 'High' },
                { value: 'URGENT', label: 'Urgent' },
              ],
            },
          ]}
          onSubmit={handleCreate}
          submitLabel="Publish"
        />
      </div>

      {isLoading ? (
        <div className="text-slate-400">Loading broadcasts...</div>
      ) : isError ? (
        <div className="text-rose-400">Failed to load announcements. Please try again later.</div>
      ) : (
        <DataTable columns={columns} data={data?.docs || []} pageCount={data?.totalPages || 1} />
      )}
    </div>
  );
}

export default AnnouncementsPage;
