import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
  ) {}

  async create(createUserDto: CreateUserDto) {
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
    return users.length != 0 ? users[0] : null;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { email: email },
    });
  }

  async findOneWithPasswordByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      select: ['id', 'email', 'password'],
      where: { email: email },
    });
  }

  async remove(id: number) {
    return await this.usersRepository.delete(id);
  }
}
