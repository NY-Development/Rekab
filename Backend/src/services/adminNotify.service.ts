import UserModel from '../modules/users/models/User';
import NotificationModel from '../modules/notifications/models/Notification';
import { isMongoConnected } from '../configs/db';
import { sendEmail } from './email.service';
import { env } from '../configs/env';

const UserM = UserModel as any;
const NotificationM = NotificationModel as any;

async function getAdmins(): Promise<{ id: string; email: string; name: string }[]> {
  if (!isMongoConnected) return [];
  const admins = await UserM.find({ role: { $in: ['ADMIN', 'SUPER_ADMIN', 'admin', 'super_admin'] } })
    .select('email name')
    .lean();
  return admins.map((a: any) => ({ id: a._id.toString(), email: a.email, name: a.name }));
}

interface AdminNotifyInput {
  title: string;
  message: string;
  type?: string;
  actionUrl?: string;
  /** Plain-text email body; when omitted, `message` is used. */
  emailBody?: string;
  /** Email subject; when omitted, `title` is used. */
  emailSubject?: string;
  /** Set false to skip the email (in-app only). Defaults to true. */
  email?: boolean;
}

/**
 * Fans a notification out to every admin: an in-app Notification record each,
 * plus a single email to all admin addresses. Never throws — a notification
 * failure must not break the action that triggered it.
 */
export async function notifyAdmins(input: AdminNotifyInput): Promise<void> {
  try {
    const admins = await getAdmins();

    // In-app notifications (one per admin).
    if (admins.length > 0) {
      await NotificationM.insertMany(
        admins.map((a) => ({
          userId: a.id,
          title: input.title,
          message: input.message,
          type: input.type || 'ADMIN_ALERT',
          actionUrl: input.actionUrl,
          isRead: false,
          sentAt: new Date().toISOString(),
        }))
      );
    }

    // Email fan-out.
    if (input.email !== false) {
      const recipients = admins.map((a) => a.email).filter(Boolean);
      const to = recipients.length > 0 ? recipients : [env.ADMIN_NOTIFY_EMAIL];
      await sendEmail(to, input.emailSubject || input.title, input.emailBody || input.message);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[adminNotify] failed:', (err as Error).message);
  }
}
