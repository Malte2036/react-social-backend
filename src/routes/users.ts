import { Connection } from "typeorm";
import { Express } from "express";
import { User } from "../entity/User";

export function usersController(app: Express, connection: Connection) {
  /**
   * @swagger
   * /users:
   *   get:
   *     description: Returns all users
   *     tags:
   *      - Users
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: user list
   */
  app.get("/users", async (req, res) => {
    const users = await connection.manager.find(User);
    return res.json(users);
  });
}
