import { ApiProperty } from '@nestjs/swagger';
import User from 'src/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Post {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  message: string;

  @ApiProperty()
  @Column()
  date: Date;

  @ApiProperty()
  @ManyToOne(() => User, (user) => user.posts)
  creator: User;
}
