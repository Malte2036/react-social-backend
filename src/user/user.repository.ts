import { EntityRepository, Repository } from 'typeorm';
import CreateUserDto from './dto/create-user.dto';
import User from './user.entity';

@EntityRepository(User)
export default class UserRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.password = createUserDto.password;

    return await this.save(user);
  }

  async listUsers(): Promise<User[]> {
    return await this.find();
  }
}
