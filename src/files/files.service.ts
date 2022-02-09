import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateFileDto } from './dto/create-file.dto';
import { File } from './entities/file.entity';
import { FilesRepository } from './files.repository';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FilesRepository)
    private readonly filesRepository: FilesRepository,
  ) {}
  async create(createFileDto: CreateFileDto, creator: User): Promise<File> {
    const file = new File();
    file.creator = creator;
    file.data = createFileDto.data;
    file.name = createFileDto.name;
    file.mimeType = createFileDto.mimeType;

    return await this.filesRepository.save(file);
  }
}
