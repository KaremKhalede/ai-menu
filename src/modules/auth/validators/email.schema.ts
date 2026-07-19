import { z } from "zod";

export const emailSchema = z.object({
  email: z
    .email("Please enter a valid email address.")
    .trim()
    .toLowerCase(),
});

export type EmailSchema = z.infer<typeof emailSchema>;