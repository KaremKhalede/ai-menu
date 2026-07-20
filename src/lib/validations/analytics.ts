import { z } from "zod";

export const chartQuerySchema = z.object({
  period: z.enum(['today', 'last7days', 'last30days', 'custom']),
  from: z.string().optional(),
  to: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.period === 'custom') {
    if (!data.from || !data.to) {
      ctx.addIssue({ 
        code: z.ZodIssueCode.custom, 
        message: "from and to are required for custom period" 
      });
    } else {
      const fromDate = new Date(data.from);
      const toDate = new Date(data.to);
      if (isNaN(fromDate.getTime())) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid from date format" });
      }
      if (isNaN(toDate.getTime())) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid to date format" });
      }
      if (fromDate > toDate) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "from date must be before to date" });
      }
    }
  }
});
