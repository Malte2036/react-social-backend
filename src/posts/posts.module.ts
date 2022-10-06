import { forwardRef, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { UsersModule } from 'src/users/users.module';
import { EventsGateway } from 'src/events.gateway';
import { AppModule } from 'src/app.module';
import { FilesModule } from 'src/files/files.module';
import { LikesModule } from 'src/likes/likes.module';
import { CommentsModule } from 'src/comments/comments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    UsersModule,
    FilesModule,
    LikesModule,
    CommentsModule,
    forwardRef(() => AppModule),
    EventsGateway,
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
