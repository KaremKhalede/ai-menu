import { db } from "@/lib/db";
import { 
  withApiHandler, 
  apiSuccess, 
  requireTenant,
  TenantRoles,
  ValidationError
} from "@/lib/api-framework";
import { aiPerformanceQuerySchema } from "@/lib/validations/analytics-ai";
import { parsePeriod } from "@/lib/analytics-helper";
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

    const parsedParams = aiPerformanceQuerySchema.safeParse(queryData);
    if (!parsedParams.success) {
      throw new ValidationError("Invalid query parameters", parsedParams.error.issues);
    }

    const { period, from, to } = parsedParams.data;
    const { startDate, endDate } = parsePeriod(period, from, to);

    // 1. Fetch all tenant dishes to ensure tenant isolation
    // (Since AnalyticsEvent currently lacks restaurantId)
    const tenantDishes = await db.dish.findMany({
      where: { category: { restaurantId } },
      select: { id: true }
    });
    const tenantDishIds = new Set(tenantDishes.map(d => d.id));

    // 2. Fetch all AI suggestions in the date range
    // NOTE: This queries global events, but we filter in-memory to enforce isolation.
    const events = await db.analyticsEvent.findMany({
      where: {
        type: 'ai_suggestion',
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    let totalSuggestionsShown = 0;
    let totalSuggestionsAccepted = 0;
    let aiGeneratedRevenue = 0;

    for (const event of events) {
      try {
        const payload = JSON.parse(event.data);
        
        // Tenant Isolation Check: Match against the tenant's valid dish catalog
        if (!payload.dishId || !tenantDishIds.has(payload.dishId)) {
          continue;
        }

        totalSuggestionsShown++;

        if (payload.converted === true) {
          totalSuggestionsAccepted++;
          if (typeof payload.orderValue === 'number') {
            aiGeneratedRevenue += payload.orderValue;
          }
        }
      } catch (e) {
        // Skip malformed data
      }
    }

    const conversionRate = totalSuggestionsShown > 0 
      ? Number(((totalSuggestionsAccepted / totalSuggestionsShown) * 100).toFixed(2))
      : 0;
      
    const averageRevenuePerConversion = totalSuggestionsAccepted > 0
      ? Number((aiGeneratedRevenue / totalSuggestionsAccepted).toFixed(2))
      : 0;

    return apiSuccess({
      period,
      totalSuggestionsShown,
      totalSuggestionsAccepted,
      totalSuggestionsDismissed: null, // SCHEMA LIMITATION: No explicitly tracked 'dismissed' status
      
      conversionRate,
      acceptanceRate: null, // SCHEMA LIMITATION: Relies on dismissed count
      
      aiGeneratedOrders: totalSuggestionsAccepted, // SCHEMA LIMITATION: Cannot group by orderId
      aiGeneratedRevenue: Number(aiGeneratedRevenue.toFixed(2)), // SCHEMA LIMITATION: Cannot verify if order was actually completed
      averageRevenuePerConversion,

      _schemaLimitations: [
        "AnalyticsEvent lacks restaurantId, requiring O(N) memory filtering using dishId.",
        "AnalyticsEvent lacks orderId, preventing verification of completed vs cancelled orders.",
        "ai-suggestion API lacks explicit 'dismissed' state, making acceptance rate impossible to calculate.",
      ]
    });
  },
  { 
    requireAuth: true,
    allowedRoles: [TenantRoles.OWNER, TenantRoles.MANAGER] 
  }
);
