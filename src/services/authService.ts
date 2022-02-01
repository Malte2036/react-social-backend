import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export function generateAccessToken(email: string) {
  return jwt.sign(email, JWT_SECRET);
}

export function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers["x-auth-token"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET as string, (err: any, user: any) => {
    console.log(err);

    if (err) return res.sendStatus(403);

    req.user = user;

    next();
  });
}
