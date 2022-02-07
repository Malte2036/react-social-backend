import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Post {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  message: string;

  @ApiProperty()
  @ManyToOne(() => User, (user) => user.posts)
  creator: User;

  @ApiProperty()
  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
