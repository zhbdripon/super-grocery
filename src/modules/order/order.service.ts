import { and, count, eq, sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import { groceryItems, orderItems, orders } from "../../db/schema/index.js";
import { ApiError } from "../../utils/apiError.js";
import type { PaginationQuery } from "../../utils/pagination.js";
import type { CreateOrderInput } from "./order.validation.js";

export class OrderService {
  async create(userId: string, input: CreateOrderInput) {
    return db.transaction(async (tx) => {
      let totalPrice = 0;
      const lineItems: Array<{
        itemId: string;
        quantity: number;
        unitPrice: number;
      }> = [];

      for (const orderItem of input.items) {
        // Lock and fetch the grocery item
        const [item] = await tx
          .select()
          .from(groceryItems)
          .where(eq(groceryItems.id, orderItem.groceryItemId))
          .for("update");

        if (!item) {
          throw ApiError.badRequest(
            `Grocery item with ID ${orderItem.groceryItemId} not found`,
          );
        }

        if (item.quantity < orderItem.quantity) {
          throw ApiError.badRequest(
            `Insufficient stock for "${item.name}". Available: ${item.quantity}, Requested: ${orderItem.quantity}`,
          );
        }

        // Decrement inventory
        await tx
          .update(groceryItems)
          .set({
            quantity: sql`${groceryItems.quantity} - ${orderItem.quantity}`,
          })
          .where(eq(groceryItems.id, item.id));

        const lineTotal = item.price * orderItem.quantity;
        totalPrice += lineTotal;

        lineItems.push({
          itemId: item.id,
          quantity: orderItem.quantity,
          unitPrice: item.price,
        });
      }

      // Create order
      const [order] = await tx
        .insert(orders)
        .values({
          userId,
          totalPrice,
          status: "confirm",
        })
        .returning();

      await tx.insert(orderItems).values(
        lineItems.map((li) => ({
          orderId: order.id,
          itemId: li.itemId,
          quantity: li.quantity,
          unitPrice: li.unitPrice,
        })),
      );

      return {
        ...order,
        items: lineItems,
      };
    });
  }

  async findByUser(userId: string, pagination: PaginationQuery) {
    const where = eq(orders.userId, userId);

    const [userOrders, [totalRow]] = await Promise.all([
      db.query.orders.findMany({
        where,
        with: {
          items: {
            with: {
              groceryItem: {
                columns: { id: true, name: true, quantityUnit: true },
              },
            },
          },
        },
        limit: pagination.limit,
        offset: pagination.offset,
        orderBy: (o, { desc }) => [desc(o.createdAt)],
      }),
      db.select({ count: count() }).from(orders).where(where),
    ]);

    return { orders: userOrders, total: totalRow.count };
  }

  async findByIdForUser(orderId: number, userId: string) {
    const order = await db.query.orders.findFirst({
      where: and(eq(orders.id, orderId), eq(orders.userId, userId)),
      with: {
        items: {
          with: {
            groceryItem: {
              columns: { id: true, name: true, quantityUnit: true },
            },
          },
        },
      },
    });

    if (!order) {
      throw ApiError.notFound("Order not found");
    }

    return order;
  }
}

export const orderService = new OrderService();
