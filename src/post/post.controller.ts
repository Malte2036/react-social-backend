import { Body, Controller, Get, Post as RequestPost } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import PostDto from './interfaces/post.dto';
import Post from './post.entity';
import PostRepository from './post.repository';

//@ApiBearerAuth
@ApiTags('post')
@Controller('/post')
export default class PostController {
  constructor(private readonly postRepository: PostRepository) {}

  @Get('/list')
  async list(): Promise<PostDto[]> {
    return await this.postRepository.list();
  }

  @RequestPost()
  async create(@Body() postDto: PostDto): Promise<PostDto> {
    return await this.postRepository.createPost(postDto);
  }
}
