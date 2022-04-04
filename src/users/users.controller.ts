import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Req,
  Post,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateFileDto } from 'src/files/dto/create-file.dto';

@ApiTags('users')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('token')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('account')
  async getAccount(@Req() req) {
    return await this.usersService.findOne(req.user.userId, true);
  }

  @Post('image')
  @ApiOkResponse()
  async changeImage(@Body() createfileDto: CreateFileDto, @Req() req) {
    const user = await this.usersService.findOne(req.user.userId);
    await this.usersService.changeImage(createfileDto, user);
  }

  @Get()
  @ApiCreatedResponse({
    description: 'List of users',
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
