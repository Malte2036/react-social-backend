import * as dotenv from "dotenv";
import express from "express";
import { initSwagger } from "./swagger";

dotenv.config();

const app = express();
const PORT = process.env.WEBSERVER_PORT || 8000;

initSwagger(app);

/**
 * @swagger
 * /test:
 *   get:
 *     description: Returns test data
 *     tags:
 *      - Test
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: test data
 */
app.get("/test", (req, res) => {
  return res.json({ id: 123456789, test: "test", test2: "test2" });
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}/`);
});
