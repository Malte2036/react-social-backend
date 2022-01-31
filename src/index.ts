import "reflect-metadata";
import { createConnection } from "typeorm";
import { User } from "./entity/User";
import routes from "./routes/routes";

createConnection()
  .then(async (connection) => {
    console.log("Inserting a new user into the database...");
    const user = new User();
    user.name = "User";
    user.email = "user@user.de";
    user.password = "12j32n2"
    await connection.manager.save(user);
    console.log("Saved a new user with id: " + user.id);

    console.log("Loading users from the database...");
    const users = await connection.manager.find(User);
    console.log("Loaded users: ", users);

    routes();
  })
  .catch((error) => console.log(error));
