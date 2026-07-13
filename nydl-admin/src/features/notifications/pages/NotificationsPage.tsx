import { z } from 'zod';
import { useNotifications, useNotificationMutations } from '@/hooks/useNotifications';
import { useUsers } from '@/hooks/useUsers';
import { DataTable } from '@/components/common/DataTable';
import { EntityFormDialog } from '@/components/common/EntityFormDialog';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { ColumnDef } from '@tanstack/react-table';
import { Notification } from '@/types';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';

const sendNotificationSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  message: z.string().min(2, 'Message must be at least 2 characters'),
  type: z.enum(['INFO', 'ALERT', 'SUCCESS', 'WARNING']),
});

export function NotificationsPage() {
  const { data, isLoading, isError } = useNotifications();
  const { sendNotification, deleteNotification } = useNotificationMutations();
  const { data: usersData } = useUsers({ limit: 100 });
  const userOptions = (usersData?.docs || []).map((u) => ({ value: u.id, label: `${u.name} (${u.email}) — ${u.role}` }));

  const handleSend = async (values: z.infer<typeof sendNotificationSchema>) => {
    try {
      await sendNotification(values);
      toast.success('Notification sent successfully');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to send notification');
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      toast.success('Notification deleted successfully');
    } catch {
      toast.error('Failed to delete notification');
    }
  };

  const columns: ColumnDef<Notification>[] = [
    { accessorKey: 'title', header: 'Title', cell: (info) => <span className="font-bold text-white">{info.getValue() as string}</span> },
    { accessorKey: 'message', header: 'Message' },
    { accessorKey: 'type', header: 'Type' },
    {
      accessorKey: 'isRead',
      header: 'Read Status',
      cell: (info) => <span>{info.getValue() ? 'Read' : 'Unread'}</span>,
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
            title="Delete Notification?"
            description="This action cannot be undone. The notification will be permanently removed."
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
          <h1 className="text-xl font-bold text-white uppercase tracking-wider">System Notifications</h1>
          <p className="text-sm text-slate-400 font-medium">Verify system alerts, browse push messages history, and trigger direct announcements.</p>
        </div>
        <EntityFormDialog
          triggerLabel="Send Direct Notification"
          title="Send Direct Notification"
          schema={sendNotificationSchema}
          fields={[
            { name: 'userId', label: 'Recipient', type: 'select', placeholder: 'Select a user', options: userOptions },
            { name: 'title', label: 'Title', placeholder: 'Assignment Reminder' },
            { name: 'message', label: 'Message', type: 'textarea', placeholder: 'Your assignment is due soon...' },
            {
              name: 'type',
              label: 'Type',
              type: 'select',
              placeholder: 'Select a type',
              options: [
                { value: 'INFO', label: 'Info' },
                { value: 'ALERT', label: 'Alert' },
                { value: 'SUCCESS', label: 'Success' },
                { value: 'WARNING', label: 'Warning' },
              ],
            },
          ]}
          onSubmit={handleSend}
          submitLabel="Send"
        />
      </div>

      {isLoading ? (
        <div className="text-slate-400">Loading notifications...</div>
      ) : isError ? (
        <div className="text-rose-400">Failed to load notifications. Please try again later.</div>
      ) : (
        <DataTable columns={columns} data={data?.docs || []} pageCount={data?.totalPages || 1} />
      )}
    </div>
  );
}

export default NotificationsPage;
