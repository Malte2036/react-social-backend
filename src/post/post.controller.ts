import { Body, Controller, Get, Post as RequestPost } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import CreatePostDto from './dto/create-post.dto';
import Post from './post.entity';
import PostRepository from './post.repository';

//@ApiBearerAuth
@ApiTags('post')
@Controller('/post')
export default class PostController {
  constructor(private readonly postRepository: PostRepository) {}

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
    return await this.postRepository.createPost(createPostDto, null);
  }
}
