import * as dotenv from "dotenv";
import * as express from "express";
import { initSwagger } from "./swagger";
import "reflect-metadata";
import { Connection } from "typeorm";
import { usersController } from "./users";
import bodyParser = require("body-parser");

export default function routes(connection: Connection) {
  dotenv.config();

  const app = express();
  const PORT = process.env.WEBSERVER_PORT || 8000;

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  initSwagger(app);

  usersController(app, connection);

  app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}/`);
  });
}
