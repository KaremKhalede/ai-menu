/**
 * Core Domain Event Model
 * Represents an immutable, purely internal domain state change.
 */
export interface DomainEvent<T = any> {
  eventId: string;
  eventType: DomainEventType;
  aggregateId: string;
  aggregateType: string;
  occurredAt: Date;
  version: number;
  metadata: Record<string, any>;
  payload: T;
}

export enum DomainEventType {
  ORDER_CREATED = "ORDER_CREATED",
  ORDER_COMPLETED = "ORDER_COMPLETED",
  REWARD_REDEEMED = "REWARD_REDEEMED",
  LOYALTY_POINTS_AWARDED = "LOYALTY_POINTS_AWARDED",
  CUSTOMER_CREATED = "CUSTOMER_CREATED",
  PROMOTION_CREATED = "PROMOTION_CREATED",
  PROMOTION_UPDATED = "PROMOTION_UPDATED",
  PROMOTION_ARCHIVED = "PROMOTION_ARCHIVED",
  
  // AI Telemetry Events
  AI_SESSION_ENDED = "AI_SESSION_ENDED",
  AI_TOOL_EXECUTED = "AI_TOOL_EXECUTED",
  AI_CONTEXT_ASSEMBLED = "AI_CONTEXT_ASSEMBLED",
}

export type EventHandler<T = any> = (event: DomainEvent<T>) => Promise<void> | void;

/**
 * In-Process Domain Event Bus
 * Strictly asynchronous, isolated, and side-effect safe.
 */
export class DomainEventBus {
  private static instance: DomainEventBus;
  private handlers: Map<DomainEventType, Set<EventHandler>> = new Map();
  
  // Read-only metrics for telemetry
  private metrics = {
    published: 0,
    processed: 0,
    failed: 0,
  };

  private constructor() {}

  public static getInstance(): DomainEventBus {
    if (!DomainEventBus.instance) {
      DomainEventBus.instance = new DomainEventBus();
    }
    return DomainEventBus.instance;
  }

  public subscribe<T>(eventType: DomainEventType, handler: EventHandler<T>): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler as EventHandler<any>);
  }

  public unsubscribe<T>(eventType: DomainEventType, handler: EventHandler<T>): void {
    if (this.handlers.has(eventType)) {
      this.handlers.get(eventType)!.delete(handler as EventHandler<any>);
    }
  }

  /**
   * Retrieves read-only metrics of the Event Bus without side effects.
   */
  public getMetrics() {
    return {
      published: this.metrics.published,
      processed: this.metrics.processed,
      failed: this.metrics.failed,
      queueDepth: Math.max(0, this.metrics.published - this.metrics.processed - this.metrics.failed),
      activeHandlers: Array.from(this.handlers.values()).reduce((sum, set) => sum + set.size, 0),
    };
  }

  /**
   * Publishes an event to all subscribed handlers completely asynchronously.
   * Isolates failures so one bad handler does not crash the bus or the caller.
   */
  public publish(event: DomainEvent): void {
    const eventHandlers = this.handlers.get(event.eventType);
    
    if (eventHandlers && eventHandlers.size > 0) {
      // Each handler execution counts as a "published" task in the queue
      this.metrics.published += eventHandlers.size;

      // Dispatch immediately but outside the current synchronous execution flow
      setImmediate(() => {
        eventHandlers.forEach(async (handler) => {
          try {
            await handler(event);
            this.metrics.processed++;
          } catch (error) {
            this.metrics.failed++;
            // Error isolation: Log the failure but do not bubble up to crash the system
            console.error(`[DomainEventBus] Error handling event ${event.eventType} (ID: ${event.eventId}):`, error);
          }
        });
      });
    }
  }
}

// Utility to generate structured events
import { randomUUID } from "crypto";

export function createDomainEvent<T>(
  eventType: DomainEventType,
  aggregateId: string,
  aggregateType: string,
  payload: T,
  metadata: Record<string, any> = {}
): DomainEvent<T> {
  return {
    eventId: randomUUID(),
    eventType,
    aggregateId,
    aggregateType,
    occurredAt: new Date(),
    version: 1,
    metadata,
    payload,
  };
}
