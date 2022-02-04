import User from 'src/user/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import CreatePostDto from './dto/create-post.dto';
import Post from './post.entity';

@EntityRepository(Post)
export default class PostRepository extends Repository<Post> {
  async list(): Promise<Post[]> {
    return this.find();
  }

  async createPost(createPostDto: CreatePostDto, creator: User): Promise<Post> {
    const post = new Post();
    post.message = createPostDto.message;
    post.creator = creator;

    this.save(post);
    return post;
  }
}
