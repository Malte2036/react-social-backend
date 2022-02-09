import { forwardRef, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostsRepository } from './posts.repository';
import { UsersModule } from 'src/users/users.module';
import { EventsGateway } from 'src/events.gateway';
import { AppModule } from 'src/app.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, PostsRepository]),
    UsersModule,
    forwardRef(() => AppModule),
    EventsGateway,
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
