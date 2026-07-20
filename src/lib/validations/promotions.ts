import { z } from "zod";
import { PromotionType } from "../promotion-constants";

const basePromotionSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional().nullable(),
  promotionType: z.nativeEnum(PromotionType),
  value: z.number().positive("Value must be greater than 0"),
  minimumOrderAmount: z.number().min(0, "Minimum order amount cannot be negative").optional().nullable(),
  maximumDiscount: z.number().min(0, "Maximum discount cannot be negative").optional().nullable(),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  active: z.boolean().optional().default(true),
  priority: z.number().int().optional().default(0),
  stackable: z.boolean().optional().default(false),
  usageLimit: z.number().int().positive().optional().nullable(),
  usagePerCustomer: z.number().int().positive().optional().nullable(),
  metadata: z.record(z.string(), z.any()).optional().default({}),
});

export const createPromotionSchema = basePromotionSchema.superRefine((data, ctx) => {
  if (data.startsAt >= data.endsAt) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "startsAt must be before endsAt",
      path: ["endsAt"],
    });
  }
});

export const updatePromotionSchema = basePromotionSchema.partial().superRefine((data, ctx) => {
  if (data.startsAt && data.endsAt && data.startsAt >= data.endsAt) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "startsAt must be before endsAt",
      path: ["endsAt"],
    });
  }
});

export const getPromotionsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  active: z.enum(["true", "false"]).optional(),
  currentlyActive: z.enum(["true", "false"]).optional(),
  promotionType: z.nativeEnum(PromotionType).optional(),
  search: z.string().optional(),
});
