import { Prisma } from "@prisma/client";
import { RequestContextManager } from "@/lib/request-context/RequestContextManager";

export class OrderService {
  /**
   * Domain service strictly responsible for order creation rules.
   */
  static async createOrder(
    tx: Prisma.TransactionClient,
    customerId: string,
    subtotal: number,
    discounts: number,
    taxes: number,
    total: number,
    items: Array<{ dishId: string; quantity: number }>
  ) {
    // 1. Validate Order Logic (e.g. minimum order size for restaurant if applicable)
    // 2. Insert Order
    const restaurantId = RequestContextManager.get().tenantId!;
    return await tx.order.create({
      data: {
        restaurantId,
        customerId,
        status: "PENDING",
        total,
        items: {
          create: items.map(item => ({
            dishId: item.dishId,
            quantity: item.quantity,
            price: 0, // Placeholder: PricingService would ideally return line-item prices
          }))
        }
      },
      include: {
        items: true
      }
    });
  }
}
