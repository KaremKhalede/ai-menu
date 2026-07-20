import { db } from "@/lib/db";

export class BusinessRulesEngine {
  /**
   * Deterministically evaluates business facts.
   * NEVER asks the AI for decisions.
   */
  public async evaluateDishAvailability(tenantId: string, dishId: string): Promise<{ exists: boolean; isAvailable: boolean; price: number; name: string }> {
    const dish = await db.dish.findFirst({
      where: {
        id: dishId,
        category: { restaurantId: tenantId }
      }
    });

    if (!dish) {
      return { exists: false, isAvailable: false, price: 0, name: "" };
    }

    // In a real scenario, this might also check inventory counts or "hidden" flags
    return {
      exists: true,
      isAvailable: dish.isAvailable,
      price: dish.price,
      name: dish.name
    };
  }

  public evaluateMaximumQuantity(requestedQuantity: number, maxAllowed: number = 20): boolean {
    return requestedQuantity > 0 && requestedQuantity <= maxAllowed;
  }
}
