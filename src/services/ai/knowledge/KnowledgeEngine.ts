import { CacheManager } from "@/lib/cache/CacheManager";
import { MenuService } from "@/services/MenuService";
import { PromotionService } from "@/services/PromotionService";
import { RequestContextManager } from "@/lib/request-context/RequestContextManager";
import { RequestContextInitializer } from "@/lib/request-context/RequestContextInitializer";

export class KnowledgeEngine {
  /**
   * Fetches the menu and compacts it into an AI-friendly Markdown string.
   * Caches the compiled string to avoid repeating serialization logic.
   */
  public async getMenuKnowledge(tenantId: string): Promise<string> {
    const cacheKey = `ai:knowledge:menu:${tenantId}`;
    
    // We cache the stringified result for fast LLM Context Assembly
    return await CacheManager.getOrSet(
      cacheKey,
      async () => {
        // We override RequestContext just in case the underlying service requires it
        return await RequestContextManager.run(
          RequestContextInitializer.create({ tenantId, requestId: "ai-knowledge-menu" }),
          async () => {
            const dishes = await MenuService.getDishes(tenantId);
            
            if (!dishes || dishes.length === 0) {
              return "MENU: The menu is currently empty.";
            }

            // Group by category
            const categoryMap = new Map<string, any[]>();
            for (const dish of dishes) {
              const catName = dish.category?.name || "Uncategorized";
              if (!categoryMap.has(catName)) {
                categoryMap.set(catName, []);
              }
              categoryMap.get(catName)!.push(dish);
            }

            // Level 1: Progressive Context Loading
            // Only Name, Price, and availability to save tokens.
            let md = "## RESTAURANT MENU\n";
            for (const [catName, catDishes] of categoryMap.entries()) {
              md += `\n### ${catName}\n`;
              for (const dish of catDishes) {
                const price = dish.price.toString();
                const availability = dish.isAvailable ? "" : " [OUT OF STOCK]";
                md += `- ${dish.name} (ID: ${dish.id}): $${price}${availability}\n`;
              }
            }

            return md.trim();
          }
        );
      },
      300 // 5 minutes cache
    );
  }

  /**
   * Fetches active promotions and compacts them into an AI-friendly string.
   */
  public async getPromotionsKnowledge(tenantId: string): Promise<string> {
    const cacheKey = `ai:knowledge:promotions:${tenantId}`;

    return await CacheManager.getOrSet(
      cacheKey,
      async () => {
        return await RequestContextManager.run(
          RequestContextInitializer.create({ tenantId, requestId: "ai-knowledge-promotions" }),
          async () => {
            const promotions = await PromotionService.getActivePromotions();
            
            if (!promotions || promotions.length === 0) {
              return "## ACTIVE PROMOTIONS\nNone at the moment.";
            }

            let md = "## ACTIVE PROMOTIONS\n";
            for (const promo of promotions) {
              md += `- ${promo.name}: ${promo.description || 'Active promotion'}\n`;
            }

            return md.trim();
          }
        );
      },
      300
    );
  }
}
