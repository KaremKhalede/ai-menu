import { z } from "zod";

export const phoneSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(8)
    .max(20),
});

export type PhoneSchema = z.infer<typeof phoneSchema>;