import * as dotenv from "dotenv";
import { Request } from "express";
import * as jwt from "jsonwebtoken";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export interface CustomRequest extends Request {
  email?: string;
}

export function generateAccessToken(email: string) {
  return jwt.sign(email, JWT_SECRET);
}

export function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers["x-auth-token"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET as string, (err: any, email: any) => {
    if (err) {
      console.log(err);
      return res.sendStatus(403);
    }

    req.email = email;

    next();
  });
}
