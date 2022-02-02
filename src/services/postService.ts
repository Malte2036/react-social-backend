import { Connection } from "typeorm";
import { Post } from "../entity/Post";
import { User } from "../entity/User";
import { createFile } from "./fileService";
import { userToShortUser } from "./userService";

export async function createPost(
  connection: Connection,
  message: string,
  creator: User,
  image?: any
) {
  const post = new Post();
  post.message = message;
  post.creator = creator;
  post.date = new Date();

  if (image) {
    const file = await createFile(connection, image, creator);
    post.image = file;
  }

  if (!creator.posts) {
    creator.posts = [post];
  } else {
    creator.posts.push(post);
  }

  await connection.manager.save<User>(creator);

  return await connection.manager.save<Post>(post);
}

export async function getAllPosts(connection: Connection) {
  let posts = await connection.manager.find(Post, {
    relations: ["creator", "image"],
  });
  posts = posts.map((post) => postToShortPost(post));
  return posts;
}

export async function findPostById(
  connection: Connection,
  postId: string
): Promise<Post | null> {
  try {
    const post = await connection.manager.findOne(Post, {
      where: { id: postId },
      relations: ["creator", "image"],
    });
    return postToShortPost(post);
  } catch (error) {}
  return null;
}

export function postToShortPost(post: Post) {
  return { ...post, creator: userToShortUser(post.creator) };
}
