import { z } from "zod";

export const topDishesQuerySchema = z.object({
  limit: z.preprocess(
    (val) => (val ? parseInt(String(val), 10) : 5),
    z.number().int().min(1).max(50).default(5)
  ),
});
