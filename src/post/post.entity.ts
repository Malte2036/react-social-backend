import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column()
  date: Date;

  @ManyToOne(() => User, (user) => user.posts)
  creator: User;
}
