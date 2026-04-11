import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar
} from "drizzle-orm/pg-core";
import { categories } from "./categories.js";
import { quantityUnitEnum } from "./enums.js";
import { orderItems } from "./orderItems.js";

export const groceryItems = pgTable("grocery_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 512 }).notNull(),
  price: integer("price").notNull(),
  quantity: integer("quantity").notNull().default(0),
  quantityUnit: quantityUnitEnum("quantity_unit").notNull(),
  categoryId: uuid("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const groceryItemsRelations = relations(
  groceryItems,
  ({ one, many }) => ({
    category: one(categories, {
      fields: [groceryItems.categoryId],
      references: [categories.id],
    }),
    orderItems: many(orderItems),
  }),
);
