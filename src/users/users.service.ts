import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
  ) {}

  async create(createUserDto: {
    name: string;
    email: string;
    password: string;
  }) {
    if ((await this.findOneByEmail(createUserDto.email)) != null) {
      throw new ConflictException('User already exists!');
    }

    const user = new User();
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.password = createUserDto.password;

    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    const users = await this.usersRepository.findByIds([id]);
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

  async remove(id: number) {
    return await this.usersRepository.delete(id);
  }
}
