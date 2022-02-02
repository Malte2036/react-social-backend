import { Connection } from "typeorm";
import { Express } from "express";
import { authenticateToken, CustomRequest } from "../services/authService";
import { findUserByEmail } from "../services/userService";
import { createFile, findFileById, getAllFiles } from "../services/fileService";

export function filesController(app: Express, connection: Connection) {
  /**
   * @swagger
   * /files:
   *   get:
   *     summary: Get all files
   *     tags:
   *      - File
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: file list
   */
  app.get("/files", authenticateToken, async (req, res) => {
    let files = await getAllFiles(connection);
    return res.json(files);
  });

  /**
   * @swagger
   * /file:
   *   post:
   *     summary: Create a file
   *     consumes:
   *       - application/json
   *     tags:
   *      - File
   *     parameters:
   *       - in: body
   *         name: user
   *         required: true
   *         schema:
   *           type: object
   *           required:
   *             - name
   *             - data
   *             - mimeType
   *           properties:
   *             name:
   *               type: string
   *             data:
   *               type: string
   *             mimeType:
   *               type: string
   *     responses:
   *       200:
   *         description:
   *       403:
   *         description:
   *       500:
   *         description:
   */
  app.post("/file", authenticateToken, async (req: CustomRequest, res) => {
    if (
      req.body.name === undefined ||
      req.body.data === undefined ||
      req.body.mimeType === undefined
    ) {
      return res.sendStatus(500);
    }

    let user = await findUserByEmail(connection, req.email);
    if (user === undefined) {
      return res.sendStatus(404);
    }

    const data = {
      name: req.body.name,
      data: req.body.data,
      mimeType: req.body.mimeType,
    };

    const file = createFile(connection, data, user);

    res.status(200).json(file);
  });

  /**
   * @swagger
   * /file/{fileId}:
   *   get:
   *     summary: Find file by id
   *     tags:
   *      - File
   *     produces:
   *      - application/json
   *     parameters:
   *        - name: fileId
   *          in: path
   *          description: ID of file to return
   *          required: true
   *          schema:
   *            type: integer
   *            format: int64
   *     responses:
   *       200:
   *         description: file
   */
  app.get("/file/:fileId", authenticateToken, async (req, res) => {
    const fileId = req.params.fileId;
    if (fileId === undefined) {
      return res.status(400).end();
    }

    const file = await findFileById(connection, fileId);
    if (file == null) {
      return res.status(404).end();
    }
    return res.json(file);
  });
}
