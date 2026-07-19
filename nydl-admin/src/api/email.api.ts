import api from '@/lib/axios';

export interface SendBroadcastEmailData {
  mode: 'all' | 'selected' | 'byRole' | 'individual';
  subject: string;
  content: string;
  recipientIds?: string[];
  role?: string;
}

export const emailApi = {
  sendBroadcast: (data: SendBroadcastEmailData) =>
    api.post('/admin/email/send', data),
};
