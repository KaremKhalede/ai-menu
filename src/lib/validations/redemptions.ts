import { z } from "zod";

export const redeemRewardSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
});

export const getRedemptionsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
});
