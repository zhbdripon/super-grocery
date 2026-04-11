import { relations } from "drizzle-orm";
import { integer, pgTable, serial, uuid } from "drizzle-orm/pg-core";
import { groceryItems } from "./groceryItems.js";
import { orders } from "./orders.js";

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  itemId: uuid("item_id")
    .notNull()
    .references(() => groceryItems.id),
  quantity: integer("quantity").notNull(),
  unitPrice: integer("unit_price").notNull(),
});

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  groceryItem: one(groceryItems, {
    fields: [orderItems.itemId],
    references: [groceryItems.id],
  }),
}));
