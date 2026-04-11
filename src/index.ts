import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./configs/env";
import authRoutes from "./modules/auth/auth.routes";
import {
  categoryRoutes,
  adminCategoryRoutes,
} from "./modules/category/category.routes";
import {
  userGroceryRoutes,
  adminGroceryRoutes,
} from "./modules/grocery/grocery.routes";
import { logger } from "./utils/logger";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, Super Grocery!");
});

app.use("/auth", authRoutes);
app.use("/categories", categoryRoutes);
app.use("/admin/categories", adminCategoryRoutes);
app.use("/grocery-items", userGroceryRoutes);
app.use("/admin/grocery-items", adminGroceryRoutes);

app.listen(env.PORT, () => {
  logger.info(`Server running on http://localhost:${env.PORT}`);
});
