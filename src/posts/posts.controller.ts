import {
  Controller,
  Get,
  Post as RequestPost,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';

@ApiTags('posts')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('token')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
  ) {}

  @RequestPost()
  @ApiCreatedResponse({
    description: 'The post has been successfully created.',
  })
  async create(@Body() createPostDto: CreatePostDto, @Req() req) {
    const user = await this.usersService.findOne(req.user.userId);
    return this.postsService.create(createPostDto, user);
  }

  @Get()
  @ApiCreatedResponse({
    description: 'List of posts',
  })
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
