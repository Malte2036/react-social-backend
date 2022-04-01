import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import { Like } from './entities/like.entity';
import { LikesRepository } from './likes.repository';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(LikesRepository)
    private readonly likesRepository: LikesRepository,
  ) {}

  async create(post: Post, user: User): Promise<Like | null> {
    const like = new Like();
    like.user = user;
    like.post = post;
    await this.likesRepository.save(like);
    return like;
  }

  async delete(like: Like): Promise<void> {
    await this.likesRepository.delete(like);
  }

  async deleteByPostIdAndUserId(postId: number, userId: number): Promise<void> {
    const like = await this.findByPostIdAndUserId(postId, userId);
    await this.delete(like);
  }

  async findAllByPostId(postId: number): Promise<Like[]> {
    if (!postId) {
      return [];
    }
    return await this.likesRepository.find({ where: { postId: postId } });
  }

  async findByPostIdAndUserId(
    postId: number,
    userId: number,
  ): Promise<Like | null> {
    if (!postId) {
      return null;
    }
    return await this.likesRepository.findOne({
      where: { postId: postId, userId: userId },
    });
  }

  async isLikedByUser(postId: number, userId: number): Promise<boolean> {
    return (await this.findByPostIdAndUserId(postId, userId)) != null;
  }
}
