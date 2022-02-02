import { Connection } from "typeorm";
import { Express } from "express";
import { authenticateToken, CustomRequest } from "../services/authService";
import { findUserByEmail } from "../services/userService";
import { createPost, findPostById, getAllPosts } from "../services/postService";

export function postsController(app: Express, connection: Connection) {
  /**
   * @swagger
   * /posts:
   *   get:
   *     summary: Get all posts
   *     tags:
   *      - Posts
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: post list
   */
  app.get("/posts", authenticateToken, async (req, res) => {
    let posts = await getAllPosts(connection);
    return res.json(posts);
  });

  /**
   * @swagger
   * /post:
   *   post:
   *     summary: Create a post
   *     consumes:
   *       - application/json
   *     tags:
   *      - Posts
   *     parameters:
   *       - in: body
   *         name: user
   *         required: true
   *         schema:
   *           type: object
   *           required:
   *             - message
   *           properties:
   *             message:
   *               type: string
   *     responses:
   *       200:
   *         description:
   *       403:
   *         description:
   *       500:
   *         description:
   */
  app.post("/post", authenticateToken, async (req: CustomRequest, res) => {
    if (req.body.message === undefined) {
      return res.sendStatus(500);
    }

    let user = await findUserByEmail(connection, req.email);
    if (user === undefined) {
      return res.sendStatus(404);
    }

    const post = createPost(connection, req.body.message, user);

    res.status(200).json(post);
  });

  /**
   * @swagger
   * /post/{postId}:
   *   get:
   *     summary: Find post by id
   *     tags:
   *      - Posts
   *     produces:
   *      - application/json
   *     parameters:
   *        - name: postId
   *          in: path
   *          description: ID of post to return
   *          required: true
   *          schema:
   *            type: integer
   *            format: int64
   *     responses:
   *       200:
   *         description: post
   */
  app.get("/post/:postId", authenticateToken, async (req, res) => {
    const postId = req.params.postId;
    if (postId === undefined) {
      return res.status(400).end();
    }

    const post = await findPostById(connection, postId);
    if (post == null) {
      return res.status(404).end();
    }
    return res.json(post);
  });
}
