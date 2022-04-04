import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('longtext')
  data: Buffer;

  @Column()
  mimeType: string;

  @Column({ nullable: true })
  creatorId: string;

  @ManyToOne(() => User, (user) => user.files)
  creator: User;
}
