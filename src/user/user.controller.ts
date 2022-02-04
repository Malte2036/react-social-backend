import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import UserDto from './interfaces/user.dto';
import User from './user.entity';
import UserRepository from './user.repository';

//@ApiBearerAuth
@ApiTags('user')
@Controller('/user')
export default class UserController {
  constructor(private readonly userService: UserRepository) {}

  @Post()
  async create(@Body() userDto: UserDto): Promise<User> {
    return await this.userService.createUser(userDto);
  }
}
