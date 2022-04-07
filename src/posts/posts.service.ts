import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventsGateway } from 'src/events.gateway';
import { FilesService } from 'src/files/files.service';
import { LikesService } from 'src/likes/likes.service';
import { User } from 'src/users/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsRepository)
    private readonly postsRepository: PostsRepository,
    private readonly likesService: LikesService,
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
    return await this.postsRepository.find();
  }

  async findAllByCreatorId(creatorId: string): Promise<Post[]> {
    return await this.postsRepository.find({ where: { creatorId } });
  }

  async findOne(id: string): Promise<Post | null> {
    if (!id) return null;

    const posts = await this.postsRepository.findByIds([id]);
    return posts.length != 0 ? posts[0] : null;
  }

  async delete(id: string) {
    const post = await this.findOne(id);
    if (post == null) {
      return;
    }
    await this.likesService.deleteAllByPostId(id);
    return await this.postsRepository.delete(id);
  }
}
