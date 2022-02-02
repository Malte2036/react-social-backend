import { Connection } from "typeorm";
import { File } from "../entity/File";
import { User } from "../entity/User";
import { userToShortUser } from "./userService";

export async function createFile(
  connection: Connection,
  data: { name: string; data: any; mimeType: string },
  creator: User
) {
  const file = new File();
  file.name = data.name;
  file.data = data.data;
  file.mimeType = data.mimeType;

  if (!creator.files) {
    creator.files = [file];
  } else {
    creator.files.push(file);
  }

  await connection.manager.save<User>(creator);

  return await connection.manager.save<File>(file);
}

export async function getAllFiles(connection: Connection) {
  let files = await connection.manager.find(File, { relations: ["creator"] });
  files = files.map((file) => fileToShortFile(file));
  return files;
}

export async function findFileById(
  connection: Connection,
  fileId: string
): Promise<File | null> {
  try {
    const file = await connection.manager.findOne(File, {
      where: { id: fileId },
      relations: ["creator"],
    });
    return fileToShortFile(file);
  } catch (error) {}
  return null;
}

export function fileToShortFile(file: File) {
  return { ...file, creator: userToShortUser(file.creator) };
}
