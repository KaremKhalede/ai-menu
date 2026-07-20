import { db } from "@/lib/db";
import { PromotionType } from "@/lib/promotion-constants";
import { TaxProvider } from "@/lib/providers/TaxProvider";
import { PromotionService } from "./PromotionService";
import { RequestContextManager } from "@/lib/request-context/RequestContextManager";

export interface PricingItem {
  dishId: string;
  quantity: number;
}

export interface AppliedPromotion {
  promotionId: string;
  name: string;
  discountAmount: number;
}

export interface PricingResult {
  subtotal: number;
  discounts: number;
  taxes: number;
  grandTotal: number;
  appliedPromotions: AppliedPromotion[];
}

export class PricingService {
  constructor(private taxProvider: TaxProvider) {}

  /**
   * Pure, deterministic, side-effect free evaluation of cart pricing.
   */
  async evaluate(items: PricingItem[]): Promise<PricingResult> {
    const restaurantId = RequestContextManager.get().tenantId!;
    // 1. Calculate Subtotal (Securely from Database)
    const subtotal = await this.calculateSubtotal(restaurantId, items);

    // 2. Evaluate Promotions
    const { discounts, appliedPromotions } = await this.evaluatePromotions(restaurantId, subtotal);

    // 3. Calculate Taxes on the discounted subtotal
    const taxableSubtotal = Math.max(0, subtotal - discounts);
    const taxes = await this.taxProvider.calculateTax(restaurantId, taxableSubtotal);

    // 4. Calculate Grand Total
    const grandTotal = Number((taxableSubtotal + taxes).toFixed(2));

    return {
      subtotal,
      discounts,
      taxes,
      grandTotal,
      appliedPromotions,
    };
  }

  private async calculateSubtotal(restaurantId: string, items: PricingItem[]): Promise<number> {
    const dishIds = items.map(item => item.dishId);
    
    // Bulk load products
    const dishes = await db.dish.findMany({
      where: {
        id: { in: dishIds },
        category: {
          restaurantId: restaurantId
        }
      },
      include: {
        category: true
      }
    });

    let subtotal = 0;

    for (const item of items) {
      const dish = dishes.find(d => d.id === item.dishId);
      
      if (!dish) {
        throw new Error(`Dish ${item.dishId} not found or unavailable`);
      }

      // Verify tenant isolation securely traversing the relations
      if (dish.category.restaurantId !== restaurantId) {
        throw new Error(`Dish ${item.dishId} does not belong to this restaurant`);
      }

      subtotal += dish.price * item.quantity;
    }

    return Number(subtotal.toFixed(2));
  }

  private async evaluatePromotions(restaurantId: string, subtotal: number): Promise<{ discounts: number, appliedPromotions: AppliedPromotion[] }> {
    const now = new Date();

    // Load all active promotions for this restaurant via cached service
    const activePromotions = await PromotionService.getActivePromotions();

    let totalDiscount = 0;
    const appliedPromotions: AppliedPromotion[] = [];
    let stopEvaluation = false;

    for (const promo of activePromotions) {
      if (stopEvaluation) break;

      // Rule: Minimum Order Amount
      if (promo.minimumOrderAmount && subtotal < promo.minimumOrderAmount) {
        continue;
      }

      // Rule: Stackability
      if (!promo.stackable) {
        stopEvaluation = true; // No further promotions can be applied
      }

      // Calculate Discount
      let discountAmount = 0;
      switch (promo.promotionType) {
        case PromotionType.PERCENT_DISCOUNT:
          discountAmount = subtotal * (promo.value / 100);
          break;
        case PromotionType.FIXED_DISCOUNT:
          discountAmount = promo.value;
          break;
        case PromotionType.FREE_DELIVERY:
          // Placeholder for FREE_DELIVERY logic (would normally zero out delivery fee)
          // For now, assume it's a 0 discount on subtotal since delivery isn't part of subtotal
          discountAmount = 0;
          break;
        default:
          discountAmount = 0;
          break;
      }

      // Rule: Cap Maximum Discount
      if (promo.maximumDiscount && discountAmount > promo.maximumDiscount) {
        discountAmount = promo.maximumDiscount;
      }

      // Prevent negative subtotal
      if (totalDiscount + discountAmount > subtotal) {
        discountAmount = subtotal - totalDiscount;
      }

      // Apply
      if (discountAmount > 0) {
        totalDiscount += discountAmount;
        appliedPromotions.push({
          promotionId: promo.id,
          name: promo.name,
          discountAmount: Number(discountAmount.toFixed(2)),
        });
      }
    }

    return {
      discounts: Number(totalDiscount.toFixed(2)),
      appliedPromotions,
    };
  }
}
