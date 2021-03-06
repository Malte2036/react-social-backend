import { ApiProperty } from '@nestjs/swagger';
import { Comment } from 'src/comments/entities/comment.entity';
import { File } from 'src/files/entities/file.entity';
import { Like } from 'src/likes/entities/like.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Post {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column('longtext')
  message: string;

  @ApiProperty()
  @Column({ nullable: true })
  creatorId?: string;

  @ApiProperty()
  @ManyToOne(() => User, (user) => user.posts)
  creator: User;

  @ApiProperty()
  @Column({ nullable: true })
  imageId: string;

  @OneToOne(() => File)
  @JoinColumn()
  image: File;

  @ApiProperty()
  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Like, (likes) => likes.post)
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
