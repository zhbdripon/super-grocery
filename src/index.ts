import cors from "cors";
import express from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { env } from "./configs/env";
import { swaggerSpec } from "./configs/swagger";
import authRoutes from "./modules/auth/auth.routes";
import {
  adminCategoryRoutes,
  categoryRoutes,
} from "./modules/category/category.routes";
import {
  adminGroceryRoutes,
  userGroceryRoutes,
} from "./modules/grocery/grocery.routes";
import orderRoutes from "./modules/order/order.routes";
import { logger } from "./utils/logger";

import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.get("/", (_req, res) => {
  res.send("Hello, Super Grocery!");
});

app.use("/auth", authRoutes);
app.use("/categories", categoryRoutes);
app.use("/admin/categories", adminCategoryRoutes);
app.use("/grocery-items", userGroceryRoutes);
app.use("/admin/grocery-items", adminGroceryRoutes);
app.use("/orders", orderRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(env.PORT, () => {
  logger.info(`Server running on http://localhost:${env.PORT}`);
});
