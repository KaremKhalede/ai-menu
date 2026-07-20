import { 
  withApiHandler, 
  apiSuccess, 
  requireTenant,
  TenantRoles,
  ValidationError
} from "@/lib/api-framework";
import { getTimelineQuerySchema } from "@/lib/validations/customers";
import { CustomerTimelineService } from "@/services/CustomerTimelineService";
import { NextRequest } from "next/server";

export const GET = withApiHandler(
  async (req: NextRequest, ctx) => {
    const restaurantId = requireTenant(ctx.user);
    const customerId = ctx.params.id;

    const { searchParams } = new URL(req.url);
    const queryData = Object.fromEntries(searchParams.entries());

    const parsed = getTimelineQuerySchema.safeParse(queryData);
    if (!parsed.success) {
      throw new ValidationError("Invalid query parameters", parsed.error.issues);
    }

    const { cursor, limit, eventType, startDate, endDate } = parsed.data;

    try {
      const timeline = await CustomerTimelineService.getTimeline(
        restaurantId,
        customerId,
        limit,
        cursor,
        eventType,
        startDate ? new Date(startDate) : undefined,
        endDate ? new Date(endDate) : undefined
      );

      return apiSuccess(timeline);
    } catch (e: any) {
      if (e.message === "Customer not found or unauthorized") {
        throw new ValidationError(e.message);
      }
      throw e;
    }
  },
  { 
    requireAuth: true,
    allowedRoles: [TenantRoles.OWNER, TenantRoles.MANAGER] 
  }
);
