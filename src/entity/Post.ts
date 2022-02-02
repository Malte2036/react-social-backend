import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { File } from "./File";
import { User } from "./User";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column()
  date: Date;

  @OneToOne(() => File)
  @JoinColumn()
  image: File;

  @ManyToOne(() => User, user => user.posts)
  creator: User
}
