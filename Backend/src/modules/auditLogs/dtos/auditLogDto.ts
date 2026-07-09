import { AuditLog, User } from '../../../types';

export interface AuditLogDto extends AuditLog {
  user?: Partial<User>;
}

export type CreateAuditLogDto = Omit<AuditLog, 'id' | 'createdAt'>;
