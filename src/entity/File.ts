import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  data: Buffer;

  @Column()
  mimeType: string;

  @ManyToOne(() => User, (user) => user.files)
  creator: User;
}
