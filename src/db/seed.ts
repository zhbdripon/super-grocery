import { db } from "./index.js";
import { categories, groceryItems } from "./schema/index.js";
import { logger } from "../utils/logger.js";

async function seed() {
  logger.info("🌱 Seeding database...");

  // ─── Categories ───
  const categoryData = [
    { name: "Fruits" },
    { name: "Vegetables" },
    { name: "Dairy" },
    { name: "Beverages" },
    { name: "Bakery" },
  ];

  const insertedCategories = await db
    .insert(categories)
    .values(categoryData)
    .onConflictDoNothing({ target: categories.name })
    .returning();

  logger.info(`✅ ${insertedCategories.length} categories created`);

  // Build a lookup map
  const allCategories = await db.select().from(categories);
  const catMap = new Map(allCategories.map((c) => [c.name, c.id]));

  // ─── Grocery Items (price in cents) ───
  const groceryData = [
    { name: "Organic Bananas", price: 149, quantity: 150, quantityUnit: "kg" as const, categoryId: catMap.get("Fruits")! },
    { name: "Red Apples", price: 299, quantity: 80, quantityUnit: "kg" as const, categoryId: catMap.get("Fruits")! },
    { name: "Strawberries", price: 499, quantity: 40, quantityUnit: "box" as const, categoryId: catMap.get("Fruits")! },
    { name: "Fresh Spinach", price: 199, quantity: 60, quantityUnit: "pack" as const, categoryId: catMap.get("Vegetables")! },
    { name: "Carrots", price: 99, quantity: 200, quantityUnit: "kg" as const, categoryId: catMap.get("Vegetables")! },
    { name: "Broccoli", price: 249, quantity: 45, quantityUnit: "piece" as const, categoryId: catMap.get("Vegetables")! },
    { name: "Whole Milk", price: 349, quantity: 100, quantityUnit: "L" as const, categoryId: catMap.get("Dairy")! },
    { name: "Cheddar Cheese", price: 599, quantity: 30, quantityUnit: "pack" as const, categoryId: catMap.get("Dairy")! },
    { name: "Greek Yogurt", price: 179, quantity: 75, quantityUnit: "piece" as const, categoryId: catMap.get("Dairy")! },
    { name: "Orange Juice", price: 399, quantity: 50, quantityUnit: "L" as const, categoryId: catMap.get("Beverages")! },
    { name: "Sourdough Bread", price: 449, quantity: 25, quantityUnit: "piece" as const, categoryId: catMap.get("Bakery")! },
    { name: "Eggs (Free Range)", price: 549, quantity: 60, quantityUnit: "dozen" as const, categoryId: catMap.get("Dairy")! },
  ];

  const insertedItems = await db
    .insert(groceryItems)
    .values(groceryData)
    .onConflictDoNothing()
    .returning();

  logger.info(`✅ ${insertedItems.length} grocery items created`);
  logger.info("🌱 Seeding complete!");

  process.exit(0);
}

seed().catch((err) => {
  logger.error(err, "Seeding failed");
  process.exit(1);
});
