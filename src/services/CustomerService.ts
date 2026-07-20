import { PrismaClient } from "@prisma/client";
import { db } from "@/lib/db";

// Use a transaction client if provided, otherwise fallback to the default db
type TransactionClient = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">;

export class CustomerService {
  /**
   * Upserts a customer based on their phone number and restaurantId.
   * If a transaction is provided, uses it.
   */
  static async upsertCustomer(
    tx: TransactionClient,
    restaurantId: string,
    phone: string,
    fullName: string
  ) {
    const customer = await tx.customer.upsert({
      where: {
        restaurantId_phone: {
          restaurantId,
          phone,
        },
      },
      update: {
        fullName, // Update name if it changed
      },
      create: {
        restaurantId,
        phone,
        fullName,
      },
    });

    // If it was just created (has no events yet), log a CUSTOMER_CREATED event
    const eventCount = await tx.customerEvent.count({
      where: { customerId: customer.id },
    });

    if (eventCount === 0) {
      await tx.customerEvent.create({
        data: {
          customerId: customer.id,
          restaurantId,
          eventType: "CUSTOMER_CREATED",
          metadata: JSON.stringify({ fullName, phone }),
        },
      });
    }

    return customer;
  }

  /**
   * Recalculates customer statistics after an order is completed,
   * and logs the ORDER_COMPLETED event.
   */
  static async updateStatsAfterCompletion(
    tx: TransactionClient,
    customerId: string,
    restaurantId: string,
    orderId: string,
    orderTotal: number,
    orderDate: Date
  ) {
    // We increment totalOrders, add to totalSpent.
    const customer = await tx.customer.findUnique({ where: { id: customerId } });
    if (!customer) return;

    const newTotalOrders = customer.totalOrders + 1;
    const newTotalSpent = customer.totalSpent + orderTotal;
    const newAverageOrderValue = newTotalOrders > 0 ? newTotalSpent / newTotalOrders : 0;

    const isFirstOrder = customer.totalOrders === 0;

    await tx.customer.update({
      where: { id: customerId },
      data: {
        totalOrders: newTotalOrders,
        totalSpent: newTotalSpent,
        averageOrderValue: newAverageOrderValue,
        lastOrderAt: orderDate,
        firstOrderAt: isFirstOrder ? orderDate : customer.firstOrderAt,
      },
    });

    // Log Event: ORDER_COMPLETED
    await tx.customerEvent.create({
      data: {
        customerId,
        restaurantId,
        eventType: "ORDER_COMPLETED",
        metadata: JSON.stringify({ orderId, orderTotal }),
      },
    });

    // Log Event: FIRST_ORDER if applicable
    if (isFirstOrder) {
      await tx.customerEvent.create({
        data: {
          customerId,
          restaurantId,
          eventType: "FIRST_ORDER",
          metadata: JSON.stringify({ orderId, orderTotal }),
        },
      });
    }
  }

  /**
   * Logs an ORDER_CREATED event. Should be called when a new order is placed.
   */
  static async logOrderCreated(
    tx: TransactionClient,
    customerId: string,
    restaurantId: string,
    orderId: string,
    orderTotal: number
  ) {
    await tx.customerEvent.create({
      data: {
        customerId,
        restaurantId,
        eventType: "ORDER_CREATED",
        metadata: JSON.stringify({ orderId, orderTotal }),
      },
    });
  }

  /**
   * Logs an ORDER_CANCELLED event.
   */
  static async logOrderCancelled(
    tx: TransactionClient,
    customerId: string,
    restaurantId: string,
    orderId: string,
    reason?: string
  ) {
    await tx.customerEvent.create({
      data: {
        customerId,
        restaurantId,
        eventType: "ORDER_CANCELLED",
        metadata: JSON.stringify({ orderId, reason }),
      },
    });
  }
}
