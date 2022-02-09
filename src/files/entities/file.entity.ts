import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
