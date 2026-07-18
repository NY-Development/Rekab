import ContactModel, { IContact } from '../models/Contact';
import { AppError } from '../../../middlewares/errorHandler';
import { notifyAdmins } from '../../../services/adminNotify.service';

const ContactM = ContactModel as any;

interface SubmitContactInput {
  name: string;
  email: string;
  topic?: string;
  message: string;
  userId?: string;
}

export class ContactService {
  async submit(input: SubmitContactInput): Promise<IContact> {
    const contact = (await ContactM.create({ ...input, status: 'NEW' })).toJSON() as IContact;

    const emailBody = [
      'A new contact/help message was submitted on NYDL.',
      '',
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      `Topic: ${input.topic || 'General'}`,
      input.userId ? `Submitted by a signed-in user (id: ${input.userId})` : 'Submitted from the public contact form',
      '',
      'Message:',
      input.message,
    ].join('\n');

    await notifyAdmins({
      title: 'New contact message',
      message: `${input.name} (${input.email}) — ${input.topic || 'General'}`,
      type: 'CONTACT',
      actionUrl: '/support',
      emailSubject: `New contact message from ${input.name}`,
      emailBody,
    });

    return contact;
  }

  async list(filters: {
    page: number;
    limit: number;
    status?: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<{ docs: IContact[]; total: number }> {
    const query: Record<string, any> = {};
    if (filters.status) query.status = filters.status.toUpperCase();
    const skip = (filters.page - 1) * filters.limit;
    const total = await ContactM.countDocuments(query);
    const docs = await ContactM.find(query)
      .sort({ [filters.sortBy]: filters.sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(filters.limit);
    return { docs: docs.map((d: any) => d.toJSON() as IContact), total };
  }

  async markHandled(id: string, adminId: string): Promise<IContact> {
    const updated = await ContactM.findByIdAndUpdate(
      id,
      { $set: { status: 'HANDLED', handledBy: adminId, handledAt: new Date().toISOString() } },
      { new: true }
    );
    if (!updated) throw new AppError('Contact message not found', 404);
    return updated.toJSON() as IContact;
  }

  async unreadCount(): Promise<number> {
    return ContactM.countDocuments({ status: 'NEW' });
  }
}
