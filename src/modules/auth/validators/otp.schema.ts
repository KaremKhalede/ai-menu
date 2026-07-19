import { z } from "zod";

export const otpSchema = z.object({
  code: z
    .string()
    .length(6, "OTP code must contain exactly 6 digits."),
});

export type OtpSchema = z.infer<typeof otpSchema>;