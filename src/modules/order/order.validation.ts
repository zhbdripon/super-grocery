import { z } from "zod";

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        groceryItemId: z.uuid("Invalid item ID"),
        quantity: z.number().int().positive("Quantity must be at least 1"),
      }),
    )
    .min(1, "At least one item is required"),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
