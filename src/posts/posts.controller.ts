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
  Post,
  HttpException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { LikesService } from 'src/likes/likes.service';
import { Like } from 'src/likes/entities/like.entity';

@ApiTags('posts')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('token')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
    private readonly likesService: LikesService,
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
    if (post.creatorId != user.id) {
      throw new UnauthorizedException('You cannot delete this post');
    }
    return this.postsService.delete(+id);
  }

  @Get(':id/likes')
  async getAllLikes(@Param('id') id: string, @Req() req): Promise<Like[]> {
    return await this.likesService.findAllByPostId(+id);
  }

  @Get(':id/likes/me')
  async isLikedByMe(@Param('id') id: string, @Req() req): Promise<boolean> {
    return await this.likesService.isLikedByUser(+id, req.user.userId);
  }

  @Get(':id/likes/count')
  async getAllLikesCount(@Param('id') id: string, @Req() req) {
    const likes = await this.likesService.findAllByPostId(+id);
    return likes.length;
  }

  @Post(':id/likes')
  async createLike(@Param('id') id: string, @Req() req) {
    if (await this.likesService.isLikedByUser(+id, req.user.userId)) {
      throw new HttpException('Post already liked by user.', 409);
    }
    const user = await this.usersService.findOne(req.user.userId);
    const post = await this.postsService.findOne(+id);
    await this.likesService.create(post, user);
  }
}
