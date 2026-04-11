import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./configs/env";
import { logger } from "./utils/logger";
import authRoutes from "./modules/auth/auth.routes";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, Super Grocery!");
});

app.use("/auth", authRoutes);

app.listen(env.PORT, () => {
  logger.info(`Server running on http://localhost:${env.PORT}`);
});
