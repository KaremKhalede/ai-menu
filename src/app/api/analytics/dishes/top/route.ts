import { db } from "@/lib/db";
import { 
  withApiHandler, 
  apiSuccess, 
  requireTenant,
  TenantRoles,
  ValidationError
} from "@/lib/api-framework";
import { topDishesQuerySchema } from "@/lib/validations/analytics-dishes";
import { NextRequest } from "next/server";

export const GET = withApiHandler(
  async (req: NextRequest, ctx) => {
    const restaurantId = requireTenant(ctx.user);

    const { searchParams } = new URL(req.url);
    const parsedParams = topDishesQuerySchema.safeParse({
      limit: searchParams.get("limit") || undefined,
    });

    if (!parsedParams.success) {
      throw new ValidationError("Invalid query parameters", parsedParams.error.issues);
    }

    const { limit } = parsedParams.data;

    // 1. Fetch all menu items for the tenant to ensure we have the names, images, and categories.
    // This uses a highly efficient select query to avoid N+1 issues and memory bloat.
    const allDishes = await db.dish.findMany({
      where: { category: { restaurantId } },
      select: {
        id: true,
        name: true,
        image: true,
        categoryId: true,
      },
    });

    if (allDishes.length === 0) {
      return apiSuccess({
        generatedAt: new Date().toISOString(),
        topDishes: [],
      });
    }

    const dishMap = new Map(allDishes.map((d) => [d.id, d]));

    // 2. Perform Grouped Aggregation on OrderItem
    // We group by both dishId and price to accurately calculate revenue without raw SQL.
    const aggregations = await db.orderItem.groupBy({
      by: ['dishId', 'price'],
      where: {
        order: {
          restaurantId,
          status: 'completed',
        },
      },
      _sum: {
        quantity: true,
      },
      _count: {
        id: true,
      },
    });

    // 3. Process and Merge Aggregations in Node
    const dishStats = new Map<string, { totalOrders: number; totalQuantitySold: number; totalRevenue: number }>();

    for (const agg of aggregations) {
      const dishId = agg.dishId;
      
      // If the dish was deleted from the menu but still exists in historical orders, we skip it
      if (!dishMap.has(dishId)) continue; 

      const quantity = agg._sum.quantity || 0;
      const count = agg._count.id;
      const revenue = quantity * agg.price; // Correctly computes revenue per price point bucket

      if (!dishStats.has(dishId)) {
        dishStats.set(dishId, { totalOrders: 0, totalQuantitySold: 0, totalRevenue: 0 });
      }

      const stats = dishStats.get(dishId)!;
      stats.totalOrders += count;
      stats.totalQuantitySold += quantity;
      stats.totalRevenue += revenue;
    }

    // 4. Combine with Dish Metadata and Sort
    const topDishes = Array.from(dishStats.entries()).map(([dishId, stats]) => {
      const dish = dishMap.get(dishId)!;
      return {
        dishId,
        name: dish.name,
        image: dish.image,
        categoryId: dish.categoryId,
        totalOrders: stats.totalOrders,
        totalQuantitySold: stats.totalQuantitySold,
        totalRevenue: Number(stats.totalRevenue.toFixed(2)),
      };
    });

    // Sort: 1. Quantity DESC, 2. Revenue DESC, 3. Name ASC
    topDishes.sort((a, b) => {
      if (b.totalQuantitySold !== a.totalQuantitySold) {
        return b.totalQuantitySold - a.totalQuantitySold;
      }
      if (b.totalRevenue !== a.totalRevenue) {
        return b.totalRevenue - a.totalRevenue;
      }
      return a.name.localeCompare(b.name);
    });

    // 5. Apply Limit
    const sliced = topDishes.slice(0, limit);

    return apiSuccess({
      generatedAt: new Date().toISOString(),
      topDishes: sliced,
    });
  },
  { 
    requireAuth: true,
    allowedRoles: [TenantRoles.OWNER, TenantRoles.MANAGER] 
  }
);
