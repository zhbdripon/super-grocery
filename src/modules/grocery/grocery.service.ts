import { and, count, eq, gt, ilike } from "drizzle-orm";
import { db } from "../../db/index.js";
import { categories, groceryItems } from "../../db/schema/index.js";
import { ApiError } from "../../utils/apiError.js";
import type { PaginationQuery } from "../../utils/pagination.js";
import type {
  CreateGroceryItemInput,
  UpdateGroceryItemInput,
  UpdateInventoryInput,
} from "./grocery.validation.js";

export class GroceryService {
  async create(input: CreateGroceryItemInput) {
    if (input.categoryId) {
      const category = await db.query.categories.findFirst({
        where: eq(categories.id, input.categoryId),
      });
      if (!category) {
        throw ApiError.badRequest("Category not found");
      }
    }

    const [item] = await db.insert(groceryItems).values(input).returning();
    return item;
  }

  async findAll(
    pagination: PaginationQuery,
    filters: { search?: string; categoryId?: string },
  ) {
    const conditions = [];

    if (filters.search) {
      conditions.push(ilike(groceryItems.name, `%${filters.search}%`));
    }
    if (filters.categoryId) {
      conditions.push(eq(groceryItems.categoryId, filters.categoryId));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [items, [totalRow]] = await Promise.all([
      db.query.groceryItems.findMany({
        where,
        with: { category: true },
        limit: pagination.limit,
        offset: pagination.offset,
        orderBy: (gi, { asc }) => [asc(gi.name)],
      }),
      db.select({ count: count() }).from(groceryItems).where(where),
    ]);

    return { items, total: totalRow.count };
  }

  async findById(id: string) {
    const item = await db.query.groceryItems.findFirst({
      where: eq(groceryItems.id, id),
      with: { category: true },
    });

    if (!item) {
      throw ApiError.notFound("Grocery item not found");
    }

    return item;
  }

  async findAvailable(
    pagination: PaginationQuery,
    filters: { search?: string; categoryId?: string },
  ) {
    const conditions = [gt(groceryItems.quantity, 0)];

    if (filters.search) {
      conditions.push(ilike(groceryItems.name, `%${filters.search}%`));
    }
    if (filters.categoryId) {
      conditions.push(eq(groceryItems.categoryId, filters.categoryId));
    }

    const where = and(...conditions);

    const [items, [totalRow]] = await Promise.all([
      db.query.groceryItems.findMany({
        where,
        with: { category: true },
        limit: pagination.limit,
        offset: pagination.offset,
        orderBy: (gi, { asc }) => [asc(gi.name)],
      }),
      db.select({ count: count() }).from(groceryItems).where(where),
    ]);

    return { items, total: totalRow.count };
  }

  async update(id: string, input: UpdateGroceryItemInput) {
    await this.findById(id);

    if (input.categoryId) {
      const category = await db.query.categories.findFirst({
        where: eq(categories.id, input.categoryId),
      });
      if (!category) {
        throw ApiError.badRequest("Category not found");
      }
    }

    const [updated] = await db
      .update(groceryItems)
      .set(input)
      .where(eq(groceryItems.id, id))
      .returning();

    return updated;
  }

  async updateInventory(id: string, input: UpdateInventoryInput) {
    const item = await this.findById(id);

    let newQuantity: number;

    switch (input.action) {
      case "set":
        newQuantity = input.quantity;
        break;
      case "increment":
        newQuantity = item.quantity + input.quantity;
        break;
      case "decrement":
        newQuantity = item.quantity - input.quantity;
        if (newQuantity < 0) {
          throw ApiError.badRequest(
            `Cannot decrement by ${input.quantity}. Current stock: ${item.quantity}`,
          );
        }
        break;
    }

    const [updated] = await db
      .update(groceryItems)
      .set({ quantity: newQuantity })
      .where(eq(groceryItems.id, id))
      .returning();

    return updated;
  }

  async remove(id: string) {
    await this.findById(id);
    await db.delete(groceryItems).where(eq(groceryItems.id, id));
  }
}

export const groceryService = new GroceryService();
