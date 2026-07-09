import { SettingRepository } from '../repositories/settingRepository';
import { UpsertSettingDto, SettingDto } from '../dtos/settingDto';
import { AppError } from '../../../middlewares/errorHandler';

export class SettingService {
  constructor(private settingRepository: SettingRepository) {}

  async getByKey(key: string): Promise<SettingDto> {
    const setting = await this.settingRepository.findByKey(key);
    if (!setting) {
      throw new AppError(`Setting '${key}' not found`, 404);
    }
    return setting;
  }

  async getPublicSettings(): Promise<SettingDto[]> {
    return this.settingRepository.findPublic();
  }

  async getAllSettings(): Promise<SettingDto[]> {
    return this.settingRepository.findAll();
  }

  async getByCategory(category: string): Promise<SettingDto[]> {
    return this.settingRepository.findByCategory(category);
  }

  async upsertSetting(updaterId: string, data: UpsertSettingDto): Promise<SettingDto> {
    const payload = {
      value: data.value,
      category: data.category,
      description: data.description,
      isPublic: data.isPublic ?? false,
      updatedBy: updaterId,
    };
    return this.settingRepository.upsert(data.key, payload);
  }

  async deleteSetting(key: string): Promise<void> {
    const setting = await this.settingRepository.findByKey(key);
    if (!setting) {
      throw new AppError(`Setting '${key}' not found`, 404);
    }
    const deleted = await this.settingRepository.delete(key);
    if (!deleted) {
      throw new AppError('Failed to delete setting', 500);
    }
  }
}
