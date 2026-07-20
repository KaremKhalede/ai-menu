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
      period: searchParams.get("period") || "last7days",
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
    // Performance: We use select to ONLY pull into memory the two small fields needed.
    // The query is isolated to the tenant, restricted to 'completed' status, and filtered by date range.
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
        total: true,
      }
    });

    // Bucket into dates/hours natively in Node
    const bucketedPoints = bucketData(
      orders,
      (order) => order.createdAt,
      (order) => order.total,
      unit,
      startDate,
      endDate
    );

    // Transform points to match requested output format { label, revenue }
    const points = bucketedPoints.map(p => ({
      label: p.label,
      revenue: p.value
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
