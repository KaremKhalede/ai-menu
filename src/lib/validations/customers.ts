import { z } from "zod";

export const getCustomersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  search: z.string().optional(),
  minSpent: z.coerce.number().min(0).optional(),
  maxSpent: z.coerce.number().min(0).optional(),
  sort: z.enum([
    "lastOrderAt_desc",
    "lastOrderAt_asc",
    "totalSpent_desc",
    "totalSpent_asc",
    "totalOrders_desc",
    "createdAt_desc",
  ]).optional().default("lastOrderAt_desc"),
});

export const getTimelineQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
  eventType: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});
