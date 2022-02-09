import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { Post } from './posts/entities/post.entity';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './database.sqlite',
      entities: [User, Post],
      synchronize: true,
    }),
    AuthModule,
    PostsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, EventsGateway],
  exports: [EventsGateway],
})
export class AppModule {}
