import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["admin", "user"]);

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirm",
  "cancelled",
  "completed",
]);

export const quantityUnitEnum = pgEnum("quantity_unit", [
  "gm",
  "kg",
  "L",
  "ml",
  "pack",
  "piece",
  "box",
  "carton",
  "dozen",
  "length",
]);
