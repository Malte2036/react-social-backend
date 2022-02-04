import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import PostRepository from './post.repository';

//@ApiBearerAuth
@ApiTags('post')
@Controller('/post')
export default class PostController {
  constructor(private readonly postRepository: PostRepository) {}

  @Get('/list')
  async list() {
    return await this.postRepository.list();
  }
}
