import { z } from "zod";
import { isValid, parseISO } from "date-fns";

export const aiPerformanceQuerySchema = z
  .object({
    period: z.enum(["today", "last7days", "last30days", "custom"]),
    from: z.string().optional(),
    to: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.period === "custom") {
        return !!data.from && !!data.to;
      }
      return true;
    },
    {
      message: "'from' and 'to' dates are required when period is 'custom'",
      path: ["period"],
    }
  )
  .refine(
    (data) => {
      if (data.period === "custom" && data.from && data.to) {
        const fromDate = parseISO(data.from);
        const toDate = parseISO(data.to);
        if (!isValid(fromDate) || !isValid(toDate)) return false;
        return fromDate <= toDate;
      }
      return true;
    },
    {
      message: "Invalid date range: 'from' must be before or equal to 'to' and both must be valid ISO strings",
      path: ["from"],
    }
  );
