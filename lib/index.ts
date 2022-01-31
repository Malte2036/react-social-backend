import * as dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const PORT = process.env.WEBSERVER_PORT || 8000;

app.get("/test", async (req, res) => {
  return res.send({ id: 123456789, test: "test", test2: "test2" });
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}/`);
});
