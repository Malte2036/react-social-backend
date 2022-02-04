import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}
  async createUser(user: UserEntity): Promise<UserEntity> {
    user.password = '123456789';
    this.usersRepository.save(user);
    return user;
  }
}
