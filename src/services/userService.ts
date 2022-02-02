import { Connection } from "typeorm";
import { User } from "../entity/User";
import { hashPlainText } from "./hash";

export async function registerUser(
  connection: Connection,
  email: string,
  name: string,
  password: string
) {
  const passwordHash = await hashPlainText(password);

  const user = new User();
  user.name = name;
  user.email = email;
  user.password = passwordHash;
  user.posts = [];

  return await connection.manager.save<User>(user);
}

export async function findUserByEmail(
  connection: Connection,
  email: string
): Promise<User | undefined> {
  return await connection.getRepository(User).findOne({
    where: { email: email },
    relations: ['posts']
  });
}

export function userToShortUser(user: User) {
  return { ...user, password: undefined };
}
