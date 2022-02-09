import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventsGateway } from 'src/events.gateway';
import { FilesRepository } from 'src/files/files.repository';
import { FilesService } from 'src/files/files.service';
import { User } from 'src/users/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsRepository)
    private readonly postsRepository: PostsRepository,
    private readonly filesService: FilesService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async create(createPostDto: CreatePostDto, creator: User) {
    const post = new Post();
    post.message = createPostDto.message;
    post.creator = creator;

    if (createPostDto.image != undefined) {
      post.image = await this.filesService.create(createPostDto.image, creator);
    }

    await this.postsRepository.save(post);
    this.eventsGateway.server.emit('posts', post);
    return post;
  }

  async findAll(): Promise<Post[]> {
    return await this.postsRepository.find({
      relations: ['creator', 'image'],
    });
  }

  async findOne(id: number): Promise<Post | null> {
    const posts = await this.postsRepository.findByIds([id], {
      relations: ['creator', 'image'],
    });
    return posts.length != 0 ? posts[0] : null;
  }

  async delete(id: number) {
    const post = await this.findOne(id);
    if (post == null) {
      return;
    }

    return await this.postsRepository.delete(id);
  }
}
