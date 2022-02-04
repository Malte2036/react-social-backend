import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from 'src/app.service';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

//@ApiBearerAuth
@ApiTags('user')
@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() userEntity: UserEntity): Promise<UserEntity> {
    return await this.userService.createUser(userEntity);
  }
}
