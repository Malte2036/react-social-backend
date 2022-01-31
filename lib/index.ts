import * as dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const PORT = process.env.WEBSERVER_PORT || 8000;

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}/`);
});
