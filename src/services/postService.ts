import { Connection } from "typeorm";
import { Post } from "../entity/Post";
import { User } from "../entity/User";
import { userToShortUser } from "./userService";

export async function createPost(
  connection: Connection,
  message: string,
  creator: User
) {
  const post = new Post();
  post.message = message;
  post.creator = creator;
  post.date = new Date();

  if (!creator.posts) {
    creator.posts = [post];
  } else {
    creator.posts.push(post);
  }

  await connection.manager.save<User>(creator);

  return await connection.manager.save<Post>(post);
}

export async function getAllPosts(connection: Connection) {
  let posts = await connection.manager.find(Post, { relations: ["creator"] });
  posts = posts.map((post) => {
    return { ...post, creator: userToShortUser(post.creator) };
  });
  return posts;
}
