import { z } from "zod";
import { RewardType } from "../loyalty-constants";

const baseRewardSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional().nullable(),
  rewardType: z.nativeEnum(RewardType),
  pointsCost: z.number().int().positive("Points cost must be greater than 0"),
  monetaryValue: z.number().min(0, "Monetary value cannot be negative").optional().nullable(),
  imageUrl: z.string().url("Invalid image URL").optional().nullable(),
  active: z.boolean().optional().default(true),
  startsAt: z.string().datetime().optional().nullable(),
  endsAt: z.string().datetime().optional().nullable(),
  usageLimit: z.number().int().positive().optional().nullable(),
});

export const createRewardSchema = baseRewardSchema.superRefine((data, ctx) => {
  if (data.startsAt && data.endsAt) {
    if (new Date(data.startsAt) > new Date(data.endsAt)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "endsAt must be after startsAt",
        path: ["endsAt"],
      });
    }
  }
});

export const updateRewardSchema = baseRewardSchema.partial().superRefine((data, ctx) => {
  if (data.startsAt && data.endsAt) {
    if (new Date(data.startsAt) > new Date(data.endsAt)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "endsAt must be after startsAt",
        path: ["endsAt"],
      });
    }
  }
});

export const getRewardsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
  active: z.enum(["true", "false"]).optional(),
  rewardType: z.nativeEnum(RewardType).optional(),
  search: z.string().optional(),
});
