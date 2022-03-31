import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { LikesRepository } from './likes.repository';
import { LikesService } from './likes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Like, LikesRepository])],
  providers: [LikesService],
})
export class LikesModule {}
