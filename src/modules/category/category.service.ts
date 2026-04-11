import { count, eq, ilike } from "drizzle-orm";
import { db } from "../../db/index.js";
import { categories, groceryItems } from "../../db/schema/index.js";
import { ApiError } from "../../utils/apiError.js";
import type { PaginationQuery } from "../../utils/pagination";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./category.validation.js";

export class CategoryService {
  async create(input: CreateCategoryInput) {
    const existing = await db.query.categories.findFirst({
      where: eq(categories.name, input.name),
    });

    if (existing) {
      throw ApiError.conflict("Category already exists");
    }

    const [category] = await db.insert(categories).values(input).returning();
    return category;
  }

  async findAll(pagination: PaginationQuery, search?: string) {
    const conditions = search
      ? ilike(categories.name, `%${search}%`)
      : undefined;

    const [items, [totalRow]] = await Promise.all([
      db
        .select()
        .from(categories)
        .where(conditions)
        .limit(pagination.limit)
        .offset(pagination.offset)
        .orderBy(categories.name),
      db.select({ count: count() }).from(categories).where(conditions),
    ]);

    return { items, total: totalRow.count };
  }

  async findById(id: string) {
    const category = await db.query.categories.findFirst({
      where: eq(categories.id, id),
    });

    if (!category) {
      throw ApiError.notFound("Category not found");
    }

    return category;
  }

  async update(id: string, input: UpdateCategoryInput) {
    await this.findById(id);

    const duplicate = await db.query.categories.findFirst({
      where: eq(categories.name, input.name),
    });

    if (duplicate && duplicate.id !== id) {
      throw ApiError.conflict("Category name already taken");
    }

    const [updated] = await db
      .update(categories)
      .set(input)
      .where(eq(categories.id, id))
      .returning();

    return updated;
  }

  async remove(id: string) {
    await this.findById(id);

    const [itemCount] = await db
      .select({ count: count() })
      .from(groceryItems)
      .where(eq(groceryItems.categoryId, id));

    if (itemCount.count > 0) {
      throw ApiError.badRequest(
        `Cannot delete category with ${itemCount.count} associated grocery item(s). Reassign or delete them first.`,
      );
    }

    await db.delete(categories).where(eq(categories.id, id));
  }
}

export const categoryService = new CategoryService();
