import { useNotifications, useNotificationMutations } from '@/hooks/useNotifications';
import { DataTable } from '@/components/common/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Notification } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Trash } from 'lucide-react';
import { toast } from 'sonner';

export function NotificationsPage() {
  const { data, isLoading } = useNotifications();
  const { sendNotification, deleteNotification } = useNotificationMutations();

  const handleSend = async () => {
    const userId = prompt('Enter User ID:');
    const title = prompt('Enter Title:');
    const message = prompt('Enter Message:');
    const type = prompt('Enter Type (e.g. INFO, ALERT):') || 'INFO';
    if (!userId || !title || !message) return;

    try {
      await sendNotification({ userId, title, message, type });
      toast.success('Notification sent successfully');
    } catch {
      toast.error('Failed to send notification');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notification?')) return;
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
          <h1 className="text-xl font-bold text-white uppercase tracking-wider">System Notifications</h1>
          <p className="text-sm text-slate-400 font-medium">Verify system alerts, browse push messages history, and trigger direct announcements.</p>
        </div>
        <Button onClick={handleSend} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
          <Plus className="mr-2 h-4 w-4" /> Send Direct Notification
        </Button>
      </div>

      {isLoading ? (
        <div className="text-slate-400">Loading notifications...</div>
      ) : (
        <DataTable columns={columns} data={data?.docs || []} pageCount={data?.totalPages || 1} />
      )}
    </div>
  );
}

export default NotificationsPage;
