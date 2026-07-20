import { db } from "@/lib/db";
import { 
  withApiHandler, 
  apiSuccess, 
  requireTenant,
  TenantRoles,
  ValidationError
} from "@/lib/api-framework";
import { chartQuerySchema } from "@/lib/validations/analytics";
import { parsePeriod, bucketData } from "@/lib/analytics-helper";
import { NextRequest } from "next/server";

export const GET = withApiHandler(
  async (req: NextRequest, ctx) => {
    const restaurantId = requireTenant(ctx.user);

    const { searchParams } = new URL(req.url);
    const queryData = {
      period: searchParams.get("period") || "today", 
      from: searchParams.get("from") || undefined,
      to: searchParams.get("to") || undefined,
    };

    const parsedParams = chartQuerySchema.safeParse(queryData);
    if (!parsedParams.success) {
      throw new ValidationError("Invalid query parameters", parsedParams.error.issues);
    }

    const { period, from, to } = parsedParams.data;
    const { startDate, endDate, unit } = parsePeriod(period, from, to);

    // Fetch the raw orders for the time window
    const orders = await db.order.findMany({
      where: {
        restaurantId,
        status: "completed",
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        createdAt: true,
      }
    });

    // Bucket into dates/hours natively in Node. Each order is counted as 1.
    const bucketedPoints = bucketData(
      orders,
      (order) => order.createdAt,
      () => 1,
      unit,
      startDate,
      endDate
    );

    // Transform points to match requested output format { label, orders }
    const points = bucketedPoints.map(p => ({
      label: p.label,
      orders: p.value
    }));

    return apiSuccess({
      period,
      unit,
      points,
    });
  },
  { 
    requireAuth: true,
    allowedRoles: [TenantRoles.OWNER, TenantRoles.MANAGER] 
  }
);
