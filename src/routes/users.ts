import { Connection } from "typeorm";
import { Express } from "express";
import { User } from "../entity/User";
import { authenticateToken } from "../services/authService";
import { userToShortUser } from "../services/userService";

export function usersController(app: Express, connection: Connection) {
  /**
   * @swagger
   * /user/{userId}:
   *   get:
   *     summary: Find user by id
   *     tags:
   *      - Users
   *     produces:
   *      - application/json
   *     parameters:
   *        - name: userId
   *          in: path
   *          description: ID of user to return
   *          required: true
   *          schema:
   *            type: integer
   *            format: int64
   *     responses:
   *       200:
   *         description: user
   */
  app.get("/user/:userId", authenticateToken, async (req, res) => {
    const userId = req.params.userId;
    if (userId === undefined) {
      return res.status(400).end();
    }

    const users = await connection.manager.findByIds(User, [userId]);
    if (users.length == 0) {
      return res.status(404).end();
    }
    const user = userToShortUser(users[0]);
    return res.json(user);
  });

  /**
   * @swagger
   * /users:
   *   get:
   *     summary: Get all users
   *     tags:
   *      - Users
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: user list
   */
  app.get("/users", authenticateToken, async (req, res) => {
    let users = await connection.manager.find(User);
    users = users.map((user) => userToShortUser(user));
    return res.json(users);
  });
}
