import { EntityRepository, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {}
