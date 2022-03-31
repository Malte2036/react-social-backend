import { ApiProperty } from '@nestjs/swagger';
import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ nullable: true })
  postId?: number;

  @ApiProperty()
  @ManyToOne(() => Post, (post) => post.likes)
  post: Post;

  @ApiProperty()
  @Column({ nullable: true })
  userId?: number;

  @ApiProperty()
  @ManyToOne(() => User, (user) => user.likes)
  user: User;
}
