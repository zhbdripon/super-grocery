import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./env";
import { logger } from "./logger";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, Super Grocery!");
});

app.listen(env.PORT, () => {
  logger.info(`Server running on http://localhost:${env.PORT}`);
});
