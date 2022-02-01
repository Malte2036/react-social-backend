import "reflect-metadata";
import { createConnection } from "typeorm";
import routes from "./routes/routes";

createConnection()
  .then(async (connection) => {
    routes(connection);
  })
  .catch((error) => console.log(error));
