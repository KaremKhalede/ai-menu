import { db } from "@/lib/db";
import { 
  withApiHandler, 
  apiSuccess, 
  requireTenant,
  TenantRoles 
} from "@/lib/api-framework";

export const GET = withApiHandler(
  async (req, ctx) => {
    const restaurantId = requireTenant(ctx.user);

    // Group orders by status to get counts and sum of totals in a single database hit
    const aggregations = await db.order.groupBy({
      by: ['status'],
      where: { restaurantId },
      _count: { id: true },
      _sum: { total: true },
    });

    let totalRevenue = 0;
    let totalOrders = 0;
    
    const statusCounts: Record<string, number> = {
      pending: 0,
      preparing: 0,
      ready: 0,
      completed: 0,
      cancelled: 0,
    };

    for (const agg of aggregations) {
      const count = agg._count.id;
      const sum = agg._sum.total || 0;
      const status = agg.status;

      // Assign to the status dictionary
      if (status in statusCounts) {
        statusCounts[status] = count;
      } else {
        statusCounts[status] = count;
      }

      totalOrders += count;
      totalRevenue += sum;
    }

    // AOV = SUM(total) / COUNT(order)
    const averageOrderValue = totalOrders > 0 ? Number((totalRevenue / totalOrders).toFixed(2)) : 0;

    return apiSuccess({
      revenue: Number(totalRevenue.toFixed(2)),
      orders: totalOrders,
      averageOrderValue,
      status: statusCounts,
    });
  },
  { 
    requireAuth: true,
    allowedRoles: [TenantRoles.OWNER, TenantRoles.MANAGER] 
  }
);
