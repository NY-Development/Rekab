import { ResourceRepository } from '../repositories/resourceRepository';
import { CreateResourceDto, UpdateResourceDto } from '../dtos/resourceDto';
import { Resource } from '../../../types';
import { AppError } from '../../../middlewares/errorHandler';

export class ResourceService {
  constructor(private resourceRepository: ResourceRepository) {}

  async getResourceById(id: string): Promise<Resource> {
    const resource = await this.resourceRepository.findById(id);
    if (!resource) {
      throw new AppError('Resource not found', 404);
    }
    return resource;
  }

  async getCourseResources(courseId: string): Promise<Resource[]> {
    return this.resourceRepository.findByCourseId(courseId);
  }

  async createResource(uploaderId: string, data: CreateResourceDto): Promise<Resource> {
    const payload = {
      ...data,
      uploadedBy: uploaderId,
    };
    return this.resourceRepository.create(payload);
  }

  async updateResource(id: string, updateData: UpdateResourceDto): Promise<Resource> {
    const resource = await this.resourceRepository.findById(id);
    if (!resource) {
      throw new AppError('Resource not found', 404);
    }
    const updated = await this.resourceRepository.update(id, updateData);
    if (!updated) {
      throw new AppError('Failed to update resource', 500);
    }
    return updated;
  }

  async deleteResource(id: string): Promise<void> {
    const resource = await this.resourceRepository.findById(id);
    if (!resource) {
      throw new AppError('Resource not found', 404);
    }
    const deleted = await this.resourceRepository.delete(id);
    if (!deleted) {
      throw new AppError('Failed to delete resource', 500);
    }
  }

  async listResources(filters: {
    page: number;
    limit: number;
    courseId?: string;
    resourceType?: string;
    search?: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<{ docs: Resource[]; total: number }> {
    return this.resourceRepository.findPaginated(filters);
  }
}
