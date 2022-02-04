import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import PostController from './post.controller';
import Post from './post.entity';
import PostRepository from './post.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostRepository])],
  controllers: [PostController],
})
export class PostModule {}
