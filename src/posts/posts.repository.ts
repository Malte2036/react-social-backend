import { EntityRepository, Repository } from 'typeorm';
import { Post } from './entities/post.entity';

@EntityRepository(Post)
export class PostsRepository extends Repository<Post> {}
