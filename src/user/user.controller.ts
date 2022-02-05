import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import CreateUserDto from './dto/create-user.dto';
import User from './user.entity';
import UserRepository from './user.repository';

//@ApiBearerAuth
@ApiTags('user')
@Controller('/user')
export default class UserController {
  constructor(private readonly userService: UserRepository) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    type: User,
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.createUser(createUserDto);
  }

  @Get()
  async list(): Promise<User[]> {
    return await this.userService.listUsers();
  }
}
