import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentsRepository } from './comments.repository';
import { User } from 'src/users/entities/user.entity';
import { Comment } from './entities/comment.entity';
import { Post } from 'src/posts/entities/post.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsRepository)
    private readonly commentsRepository: CommentsRepository,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    post: Post,
    creator: User,
  ): Promise<Comment> {
    const comment = new Comment();
    comment.message = createCommentDto.message;
    comment.creator = creator;
    comment.post = post;

    return await this.commentsRepository.save(comment);
  }

  async findAllByPostId(postId: string): Promise<Comment[]> {
    return await this.commentsRepository.find({ where: { postId } });
  }
}
