import { db } from "@/lib/db";
import { PricingService } from "./PricingService";
import { OrderService } from "./OrderService";
import { RewardRedemptionService } from "./RewardRedemptionService";
import { LoyaltyService } from "./LoyaltyService";
import { StandardTaxProvider } from "@/lib/providers/TaxProvider";
import { DomainEventBus, createDomainEvent, DomainEventType } from "@/lib/events/DomainEvent";
import { LockManager } from "@/lib/concurrency/LockManager";
import { LockScope } from "@/lib/concurrency/LockProvider";

import { RequestContextManager } from "@/lib/request-context/RequestContextManager";

export class CheckoutService {
  /**
   * Orchestrates the checkout workflow.
   * This service is strictly an orchestrator and contains NO domain business logic.
   */
  static async processCheckout(
    customerId: string,
    items: Array<{ dishId: string; quantity: number }>,
    rewardId?: string | null
  ) {
    const restaurantId = RequestContextManager.get().tenantId!;
    // 1. Concurrency Optimization: Prevent double-clicking checkout
    // Fails fast if the customer is already checking out simultaneously.
    return await LockManager.withLock(LockScope.CUSTOMER, customerId, async () => {
      // ==========================================
      // PHASE 1: Pure Calculations & Validation
      // (Outside Transaction Boundary)
      // ==========================================
      
      // Verify Customer exists and belongs to this tenant
      const customer = await db.customer.findFirst({
      where: { id: customerId, restaurantId }
    });
    if (!customer) {
      throw new Error("Customer not found");
    }

    // Call PricingService (Side-effect free math)
    const pricingService = new PricingService(new StandardTaxProvider());
    const pricingResult = await pricingService.evaluate(items);

    // ==========================================
    // PHASE 2: Execution & State Mutation
    // (Inside Transaction Boundary)
    // ==========================================
    
    // We capture events inside the transaction to publish AFTER successful commit
    const pendingEvents: any[] = [];

    const transactionResult = await db.$transaction(async (tx) => {
      // Future Compensation Boundary Note:
      // If we implement an external Payment Gateway (e.g. Stripe) in the future,
      // it would be executed HERE, outside the Prisma transaction or tightly managed 
      // via compensation hooks (Saga pattern) if it fails, ensuring we can void the 
      // captured payment if DB commit fails. For this sprint, all operations are local.

      // 1. Reward Redemption (if applicable)
      let redemption: any = null;
      if (rewardId) {
        redemption = await RewardRedemptionService.redeemReward(
          rewardId,
          customerId,
          tx
        );
        
        pendingEvents.push(createDomainEvent(
          DomainEventType.REWARD_REDEEMED,
          redemption.id,
          "RewardRedemption",
          {
            restaurantId,
            customerId,
            rewardId,
            pointsSpent: redemption.pointsSpent,
            rewardName: "Redeemed Reward", // In a real system, passed from reward payload
          }
        ));
      }

      // 2. Create the physical Order
      const order = await OrderService.createOrder(
        tx,
        customerId,
        pricingResult.subtotal,
        pricingResult.discounts,
        pricingResult.taxes,
        pricingResult.grandTotal,
        items
      );

      // 3. Award Loyalty Points based on Final Paid Amount
      const pointsEarned = Math.floor(pricingResult.grandTotal);
      await LoyaltyService.awardPointsForOrder(
        tx,
        customerId,
        restaurantId,
        order.id,
        pricingResult.grandTotal
      );

      pendingEvents.push(createDomainEvent(
        DomainEventType.LOYALTY_POINTS_AWARDED,
        customerId,
        "Customer",
        {
          restaurantId,
          customerId,
          orderId: order.id,
          pointsEarned
        }
      ));

      // 4. Queue ORDER_CREATED event
      pendingEvents.push(createDomainEvent(
        DomainEventType.ORDER_CREATED,
        order.id,
        "Order",
        {
          restaurantId,
          customerId,
          grandTotal: pricingResult.grandTotal,
        }
      ));

      // Return Orchestrated Summary Result
      return {
        order: {
          id: order.id,
          status: order.status,
          total: order.total
        },
        pricing: pricingResult,
        loyaltySummary: {
          pointsEarned: Math.floor(pricingResult.grandTotal), // Reflects typical 1:1 rule used in LoyaltyService
          rewardRedeemed: !!redemption
        }
      };
    });

    // ==========================================
    // PHASE 3: Domain Event Publication
    // (Post Transaction Commit)
    // ==========================================
    const bus = DomainEventBus.getInstance();
    for (const event of pendingEvents) {
      bus.publish(event);
    }

    return transactionResult;
    }, 10000); // 10 second TTL for checkout lock
  }
}
