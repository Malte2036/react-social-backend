import { EntityRepository, Repository } from 'typeorm';
import UserDto from './interfaces/user.dto';
import User from './user.entity';

@EntityRepository(User)
export default class UserRepository extends Repository<User> {
  async createUser(userDto: UserDto): Promise<User> {
    const user = new User();
    user.name = userDto.name;
    user.email = userDto.email;
    user.password = '123456789';

    this.save(user);
    return user;
  }
}
