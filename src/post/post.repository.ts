import { EntityRepository, Repository } from 'typeorm';
import Post from './post.entity';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  async list(): Promise<Post[]> {
    return this.find();
  }
}
