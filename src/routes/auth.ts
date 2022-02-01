import { Connection } from "typeorm";
import { Express } from "express";
import { generateAccessToken } from "../services/authService";
import { findUserByEmail, registerUser } from "../services/userService";
import { compareHash } from "../services/hash";

export function authController(app: Express, connection: Connection) {
  /**
   * @swagger
   * /auth/register:
   *   post:
   *     summary: Register a new account
   *     consumes:
   *       - application/json
   *     tags:
   *      - Auth
   *     parameters:
   *       - in: body
   *         name: user
   *         required: true
   *         schema:
   *           type: object
   *           required:
   *             - name
   *             - email
   *             - password
   *           properties:
   *             name:
   *               type: string
   *             email:
   *               type: string
   *             password:
   *               type: string
   *     responses:
   *       405:
   *         description: Invalid input
   *       406:
   *         description: Account already exists
   *       200:
   *         description: 
   */
  app.post("/auth/register", async (req, res) => {
    if (
      req.body.email === undefined ||
      req.body.name === undefined ||
      req.body.password === undefined
    ) {
      return res.status(405).send("Invalid input!");
    }

    let user = await findUserByEmail(connection, req.body.email);
    if (user !== undefined) {
      return res.status(406).send("Account already exists!");
    }

    user = await registerUser(
      connection,
      req.body.email,
      req.body.name,
      req.body.password
    );

    const token = generateAccessToken(user.email as string);

    res.json({ token: token, user: user });
  });

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Login account
   *     consumes:
   *       - application/json
   *     tags:
   *      - Auth
   *     parameters:
   *       - in: body
   *         name: user
   *         required: true
   *         schema:
   *           type: object
   *           required:
   *             - email
   *             - password
   *           properties:
   *             email:
   *               type: string
   *             password:
   *               type: string
   *     responses:
   *       200:
   *         description:
   *       403:
   *         description:
   *       404:
   *         description:
   *       500:
   *         description:
   */
  app.post("/auth/login", async (req, res) => {
    if (req.body.email === undefined || req.body.password === undefined) {
      return res.sendStatus(500);
    }

    const user = await findUserByEmail(connection, req.body.email);
    if (user === undefined) {
      return res.sendStatus(404);
    }
    const valid = await compareHash(user.password, req.body.password);
    if (!valid) {
      return res.status(403).send("Password invalid");
    }

    const token = generateAccessToken(req.body.email as string);
    res.status(200).json({ token: token, user: user });
  });
}
