import { z } from "zod";

const quantityUnits = [
  "gm", "kg", "L", "ml", "pack", "piece", "box", "carton", "dozen", "length",
] as const;

export const createGroceryItemSchema = z.object({
  name: z.string().min(1, "Name is required").max(512),
  price: z.number().positive("Price must be positive"),
  quantity: z.number().int().min(0, "Quantity cannot be negative"),
  quantityUnit: z.enum(quantityUnits, { message: "Invalid quantity unit" }),
  categoryId: z.uuid().optional().nullable(),
});

export const updateGroceryItemSchema = z.object({
  name: z.string().min(1).max(512).optional(),
  price: z.number().positive("Price must be positive").optional(),
  quantityUnit: z.enum(quantityUnits).optional(),
  categoryId: z.uuid().optional().nullable(),
});

export const updateInventorySchema = z.object({
  action: z.enum(["set", "increment", "decrement"]),
  quantity: z.number().int().min(0, "Quantity cannot be negative"),
});

export type CreateGroceryItemInput = z.infer<typeof createGroceryItemSchema>;
export type UpdateGroceryItemInput = z.infer<typeof updateGroceryItemSchema>;
export type UpdateInventoryInput = z.infer<typeof updateInventorySchema>;
