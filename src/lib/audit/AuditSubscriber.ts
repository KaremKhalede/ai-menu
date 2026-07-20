import { DomainEventBus, DomainEventType, DomainEvent } from "@/lib/events/DomainEvent";
import { AuditLogger } from "./AuditLogger";

/**
 * Translates semantic business events into persistent Audit Logs.
 * This completely decouples business services from logging mechanics,
 * while still preserving explicit business operations in the audit trail.
 */
export function initializeAuditSubscriber() {
  const bus = DomainEventBus.getInstance();

  const logBusinessEvent = (action: string) => async (event: DomainEvent) => {
    // AuditLogger automatically pulls RequestContext via AsyncLocalStorage
    // if the event is dispatched within an active request boundary.
    await AuditLogger.logCustom(action, event.aggregateType, event.aggregateId, {
      ...event.metadata,
      payload: event.payload
    });
  };

  // Map pure business domain events to semantic Audit actions
  bus.subscribe(DomainEventType.ORDER_COMPLETED, logBusinessEvent("CHECKOUT_COMPLETED"));
  bus.subscribe(DomainEventType.ORDER_CREATED, logBusinessEvent("ORDER_CREATED"));
  bus.subscribe(DomainEventType.REWARD_REDEEMED, logBusinessEvent("REWARD_REDEEMED"));
  bus.subscribe(DomainEventType.PROMOTION_CREATED, logBusinessEvent("PROMOTION_ACTIVATED"));
  bus.subscribe(DomainEventType.PROMOTION_UPDATED, logBusinessEvent("PROMOTION_MODIFIED"));
  bus.subscribe(DomainEventType.PROMOTION_ARCHIVED, logBusinessEvent("PROMOTION_ARCHIVED"));
  bus.subscribe(DomainEventType.CUSTOMER_CREATED, logBusinessEvent("CUSTOMER_CREATED"));
  bus.subscribe(DomainEventType.LOYALTY_POINTS_AWARDED, logBusinessEvent("LOYALTY_POINTS_AWARDED"));
}

// Auto-initialize when the file is loaded
initializeAuditSubscriber();
