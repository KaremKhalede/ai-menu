import { db } from "@/lib/db";
import { CacheManager } from "@/lib/cache/CacheManager";
import { CacheKeyBuilder } from "@/lib/cache/CacheKeyBuilder";

export class MenuService {
  /**
   * Retrieves all dishes for a restaurant, utilizing Cache-Aside / Read-Through.
   */
  static async getDishes(restaurantId: string) {
    const cacheKey = CacheKeyBuilder.menu(restaurantId);

    return await CacheManager.getOrSet(
      cacheKey,
      async () => {
        return await db.dish.findMany({
          where: { category: { restaurantId } },
          include: { category: true },
        });
      },
      300 // 5 minutes TTL
    );
  }

  /**
   * Call this explicitly to invalidate the menu cache whenever a dish or category changes.
   */
  static async invalidateMenuCache(restaurantId: string) {
    await CacheManager.delete(CacheKeyBuilder.menu(restaurantId));
  }
}
