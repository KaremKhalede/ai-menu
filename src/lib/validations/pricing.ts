import { z } from "zod";

export const evaluatePricingSchema = z.object({
  items: z.array(
    z.object({
      dishId: z.string().min(1, "Dish ID is required"),
      quantity: z.number().int().positive("Quantity must be greater than 0"),
    })
  ).min(1, "Cart must contain at least one item"),
});
