import * as dotenv from "dotenv";
import * as express from "express";
import { initSwagger } from "./swagger";
import "reflect-metadata";
import { Connection } from "typeorm";
import { usersController } from "./users";

export default function routes(connection: Connection) {
  dotenv.config();

  const app = express();
  const PORT = process.env.WEBSERVER_PORT || 8000;

  initSwagger(app);

  usersController(app, connection);

  app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}/`);
  });
}
