import { useNavigate } from 'react-router-dom';
import { LifeBuoy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContactsUnreadCount } from '@/hooks/useContacts';

/**
 * Header badge for the admin: shows the count of unhandled support messages
 * and jumps to the Support Inbox. Contact/help submissions land here (and are
 * emailed to admins) the moment a student or visitor sends one.
 */
export function NotificationBell() {
  const navigate = useNavigate();
  const { data: count = 0 } = useContactsUnreadCount();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => navigate('/support')}
      title={count > 0 ? `${count} unhandled support message${count === 1 ? '' : 's'}` : 'Support inbox'}
      className="relative h-9 w-9 border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-900"
    >
      <LifeBuoy className="h-4 w-4" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Button>
  );
}

export default NotificationBell;
