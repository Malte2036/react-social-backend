import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from './posts/posts.module';
import { Post } from './posts/entities/post.entity';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { EventsGateway } from './events.gateway';
import { FilesModule } from './files/files.module';
import { File } from './files/entities/file.entity';
import { Like } from './likes/entities/like.entity';
import { LikesModule } from './likes/likes.module';
import { CommentsModule } from './comments/comments.module';
import { Comment } from './comments/entities/comment.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.MARIADB_HOST ?? 'localhost',
      port: 3306,
      username: 'root',
      password: process.env.MARIADB_ROOT_PASSWORD,
      database: 'react-social',
      entities: [User, Post, File, Like, Comment],
      synchronize: true,
    }),
    AuthModule,
    FilesModule,
    PostsModule,
    UsersModule,
    LikesModule,
    CommentsModule,
  ],
  providers: [EventsGateway],
  exports: [EventsGateway],
})
export class AppModule {}
