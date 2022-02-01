import { Connection } from "typeorm";
import { Express } from "express";
import { User } from "../entity/User";
import { authenticateToken, CustomRequest } from "../services/authService";
import { findUserByEmail, userToShortUser } from "../services/userService";

export function usersController(app: Express, connection: Connection) {
  /**
   * @swagger
   * /user:
   *   get:
   *     summary: Get current user
   *     tags:
   *      - Users
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: user
   */
  app.get("/user", authenticateToken, async (req: CustomRequest, res) => {
    if (!req.email) {
      return res.sendStatus(500);
    }

    let user = await findUserByEmail(connection, req.email);
    user = userToShortUser(user);

    return res.json(user);
  });

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
