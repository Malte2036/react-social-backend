import { EntityRepository, Repository } from 'typeorm';
import PostDto from './interfaces/post.dto';
import Post from './post.entity';

@EntityRepository(Post)
export default class PostRepository extends Repository<Post> {
  async list(): Promise<Post[]> {
    return this.find();
  }

  async createPost(postDto: PostDto): Promise<Post> {
    const post = new Post();
    post.message = postDto.message;
    post.creator = null;
    post.date = new Date();

    this.save(post);
    return post;
  }
}
