import * as bcrypt from "bcrypt";

const saltRounds = Number.parseInt(process.env.HASH_SALT_ROUNDS);

export async function hashPlainText(plainText: string) {
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(plainText, salt);
}

export async function compareHash(hash: string, plainText: string) {
  return await bcrypt.compare(plainText, hash);
}
