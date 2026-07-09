import { User } from '../../../types';

export interface SettingDto {
  id: string;
  key: string;
  value: any;
  category: string;
  description?: string;
  isPublic: boolean;
  updatedBy?: Partial<User>;
  createdAt: string;
  updatedAt: string;
}

export type UpsertSettingDto = {
  key: string;
  value: any;
  category: string;
  description?: string;
  isPublic?: boolean;
};
