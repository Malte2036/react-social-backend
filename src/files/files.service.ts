import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { User } from 'src/users/entities/user.entity';
import { CreateFileDto } from './dto/create-file.dto';
import { File } from './entities/file.entity';
import { FilesRepository } from './files.repository';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FilesRepository)
    private readonly filesRepository: FilesRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async create(createFileDto: CreateFileDto, creator: User): Promise<File> {
    const file = new File();
    file.creator = creator;
    file.data = createFileDto.data;
    file.name = createFileDto.name;
    file.mimeType = createFileDto.mimeType;

    return await this.filesRepository.save(file);
  }

  async findOne(id: number): Promise<File | null> {
    if (!id) return null;

    const cacheValue: File = await this.cacheManager.get(id.toString());
    if (cacheValue && cacheValue instanceof File) {
      return cacheValue;
    }

    const files = await this.filesRepository.findByIds([id]);
    const file = files.length != 0 ? files[0] : null;
    if (file) {
      this.cacheManager.set(id.toString(), file, { ttl: 3600 });
    }
    return file;
  }
}
