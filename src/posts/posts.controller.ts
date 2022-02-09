import {
  Controller,
  Get,
  Post as RequestPost,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  NotFoundException,
  UnauthorizedException,
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
  async remove(@Param('id') id: string, @Req() req) {
    const user = await this.usersService.findOne(req.user.userId);
    const post = await this.postsService.findOne(+id);
    if (post == null) {
      throw new NotFoundException('Post not found');
    }
    if (post.creator.id != user.id) {
      throw new UnauthorizedException('You cannot delete this post');
    }
    return this.postsService.delete(+id);
  }
}
