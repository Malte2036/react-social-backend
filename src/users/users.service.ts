import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFileDto } from 'src/files/dto/create-file.dto';
import { FilesService } from 'src/files/files.service';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
    private readonly filesService: FilesService,
  ) {}

  async create(createUserDto: {
    name: string;
    email: string;
    password: string;
  }) {
    try {
      await this.findOneByEmail(createUserDto.email);
    } catch (error) {
      if (error instanceof NotFoundException) {
        const user = new User();
        user.name = createUserDto.name;
        user.email = createUserDto.email;
        user.password = createUserDto.password;

        return await this.usersRepository.save(user);
      }
      throw new InternalServerErrorException();
    }
    throw new ConflictException('User already exists!');
  }

  async changeImage(imageName: string, user: User) {
    const image = await this.filesService.create(imageName, user);
    user.image = image;

    await this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: string, includeEmail?: boolean): Promise<User | null> {
    if (!id) return null;

    const users = includeEmail
      ? await this.usersRepository.findByIds([id], {
          select: ['id', 'name', 'email', 'imageId', 'createdAt', 'updatedAt'],
        })
      : await this.usersRepository.findByIds([id]);
    if (users.length == 0) {
      throw new NotFoundException('User not found');
    }
    return users[0];
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { email: email },
    });
    if (user == null) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOneWithPasswordByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      select: ['id', 'email', 'password'],
      where: { email: email },
    });
    if (user == null) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async remove(id: string) {
    return await this.usersRepository.delete(id);
  }
}
