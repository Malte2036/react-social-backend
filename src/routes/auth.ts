import { Connection } from "typeorm";
import { Express } from "express";
import { generateAccessToken } from "../services/authService";
import { User } from "../entity/User";

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
   *         content: {}
   *       200:
   *         description: token
   */
  app.post("/auth/register", (req, res) => {
    const token = generateAccessToken(req.body.email as string);

    res.json({ token: token });
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
   *       405:
   *         description: Invalid input
   *         content: {}
   *       200:
   *         description: token
   */
  app.post("/auth/login", (req, res) => {
    const token = generateAccessToken(req.body.email as string);
    res.json({ token: token });
  });
}
