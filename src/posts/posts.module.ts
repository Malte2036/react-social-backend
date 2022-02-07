import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostsRepository } from './posts.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostsRepository])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
