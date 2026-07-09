import SettingModel from '../models/Setting';
import { SettingDto } from '../dtos/settingDto';
import { isMongoConnected } from '../../../configs/db';

const SettingM = SettingModel as any;

export class SettingRepository {
  async findByKey(key: string): Promise<SettingDto | null> {
    if (isMongoConnected) {
      const doc = await SettingM.findOne({ key }).populate('updatedBy', 'name email role avatar');
      return doc ? (doc.toJSON() as SettingDto) : null;
    }
    return null;
  }

  async findByCategory(category: string): Promise<SettingDto[]> {
    if (isMongoConnected) {
      const docs = await SettingM.find({ category }).populate('updatedBy', 'name email role avatar').sort({ key: 1 });
      return docs.map((d: any) => d.toJSON() as SettingDto);
    }
    return [];
  }

  async findPublic(): Promise<SettingDto[]> {
    if (isMongoConnected) {
      const docs = await SettingM.find({ isPublic: true }).sort({ key: 1 });
      return docs.map((d: any) => d.toJSON() as SettingDto);
    }
    return [];
  }

  async findAll(): Promise<SettingDto[]> {
    if (isMongoConnected) {
      const docs = await SettingM.find().populate('updatedBy', 'name email role avatar').sort({ category: 1, key: 1 });
      return docs.map((d: any) => d.toJSON() as SettingDto);
    }
    return [];
  }

  async upsert(key: string, data: any): Promise<SettingDto> {
    if (isMongoConnected) {
      const doc = await SettingM.findOneAndUpdate(
        { key },
        { $set: { ...data, key, updatedAt: new Date().toISOString() }, $setOnInsert: { createdAt: new Date().toISOString() } },
        { new: true, upsert: true }
      ).populate('updatedBy', 'name email role avatar');
      return doc.toJSON() as SettingDto;
    }
    throw new Error('Database not connected');
  }

  async delete(key: string): Promise<boolean> {
    if (isMongoConnected) {
      const result = await SettingM.findOneAndDelete({ key });
      return !!result;
    }
    return false;
  }
}
