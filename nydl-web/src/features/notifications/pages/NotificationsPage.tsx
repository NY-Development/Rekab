import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, CheckCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function NotificationsPage() {
  const { data: notificationsRes, isLoading, error } = useNotifications();
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  const notificationsList = notificationsRes?.data?.docs || [];

  const handleMarkRead = async (id: string) => {
    try {
      await markReadMutation.mutateAsync(id);
      toast.success('Notification marked as read');
    } catch {
      toast.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllReadMutation.mutateAsync();
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to mark all as read');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 border-none pb-0">Notifications</h2>
          <p className="text-sm text-slate-550 mt-1">Review alerts, updates, and feedback messages from your courses.</p>
        </div>
        {notificationsList.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            disabled={markAllReadMutation.isPending}
            className="flex items-center gap-1.5 font-semibold text-xs text-slate-650"
          >
            <CheckCheck className="h-4 w-4" /> Clear All / Read All
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-800 p-4 rounded-md text-sm">
          Failed to load notifications.
        </div>
      ) : notificationsList.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-16 text-center text-slate-400 max-w-sm mx-auto flex flex-col items-center">
          <BellOff className="h-10 w-10 text-slate-350 mb-3" />
          <h3 className="text-sm font-semibold text-slate-700">All caught up!</h3>
          <p className="text-xs text-slate-500 mt-1 select-none">No unread alerts or updates at this time.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-205 rounded-lg overflow-hidden shadow-sm divide-y divide-slate-100">
          {notificationsList.map((notif: any) => (
            <div
              key={notif.id}
              onClick={() => !notif.isRead && handleMarkRead(notif.id)}
              className={`p-5 flex gap-4 transition-colors cursor-pointer group ${
                notif.isRead ? 'bg-white opacity-70' : 'bg-blue-50/20 hover:bg-slate-50'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                notif.isRead ? 'bg-slate-105 text-slate-400' : 'bg-blue-50 text-blue-600 border border-blue-100'
              }`}>
                <Bell className="h-4.5 w-4.5" />
              </div>
              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-bold text-slate-900 leading-tight truncate ${!notif.isRead && 'text-blue-600'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                    {new Date(notif.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{notif.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
