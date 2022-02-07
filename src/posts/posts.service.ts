import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsRepository)
    private readonly postsRepository: PostsRepository,
  ) {}

  async create(createPostDto: CreatePostDto, creator: User) {
    const post = new Post();
    post.message = createPostDto.message;
    post.creator = creator;

    return await this.postsRepository.save(post);
  }

  async findAll(): Promise<Post[]> {
    return await this.postsRepository.find({ relations: ['creator'] });
  }

  async findOne(id: number): Promise<Post | null> {
    const posts = await this.postsRepository.findByIds([id], {
      relations: ['creator'],
    });
    return posts.length != 0 ? posts[0] : null;
  }

  async remove(id: number) {
    return await this.postsRepository.delete(id);
  }
}
