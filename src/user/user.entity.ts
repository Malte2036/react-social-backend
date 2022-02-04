import { ApiProperty } from '@nestjs/swagger';
import Post from 'src/post/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Post, (posts) => posts.creator)
  posts: Post[];
}
