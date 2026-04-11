import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./configs/env";
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
app.use("/orders", orderRoutes);

app.listen(env.PORT, () => {
  logger.info(`Server running on http://localhost:${env.PORT}`);
});
