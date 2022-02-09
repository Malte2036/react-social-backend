import { EntityRepository, Repository } from 'typeorm';
import { File } from './entities/file.entity';

@EntityRepository(File)
export class FilesRepository extends Repository<File> {}
