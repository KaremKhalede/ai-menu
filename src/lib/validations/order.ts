import { z } from "zod";

export const createOrderSchema = z.object({
  tableNumber: z.number().int().positive("Table number must be positive").optional().nullable(),
  customerName: z.string().max(100).optional().nullable(),
  customerPhone: z.string().max(20).optional().nullable(),
  items: z.array(
    z.object({
      dishId: z.string().min(1, "Dish ID is required"),
      quantity: z.number().int().positive("Quantity must be positive"),
      addons: z.array(
        z.object({
          name: z.string(),
        })
      ).optional().default([]),
    })
  ).min(1, "Order must contain at least one item"),
});
