import { Body, Controller, Get, Post as RequestPost } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import UserRepository from 'src/user/user.repository';
import CreatePostDto from './dto/create-post.dto';
import Post from './post.entity';
import PostRepository from './post.repository';

//@ApiBearerAuth
@ApiTags('post')
@Controller('/post')
export default class PostController {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
  ) {}

  @Get('/list')
  @ApiCreatedResponse({
    description: 'List of posts',
    type: [Post],
  })
  async list(): Promise<Post[]> {
    return await this.postRepository.list();
  }

  @RequestPost()
  @ApiCreatedResponse({
    description: 'The post has been successfully created.',
    type: Post,
  })
  async create(@Body() createPostDto: CreatePostDto): Promise<Post> {
    const user = this.userRepository.listUsers()[0];
    return await this.postRepository.createPost(createPostDto, user);
  }
}
