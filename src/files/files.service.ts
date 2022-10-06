import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly filesRepository: Repository<File>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async create(imageName: string, creator: User): Promise<File> {
    const file = new File();
    file.creator = creator;
    file.name = imageName;

    return await this.filesRepository.save(file);
  }

  async findOne(id: string): Promise<File | null> {
    if (!id) return null;

    const cacheValue: File = await this.cacheManager.get(id);
    if (cacheValue && cacheValue instanceof File) {
      return cacheValue;
    }

    const files = await this.filesRepository.findByIds([id]);
    const file = files.length != 0 ? files[0] : null;
    if (file) {
      this.cacheManager.set(id, file, 3600);
    }
    return file;
  }
}
