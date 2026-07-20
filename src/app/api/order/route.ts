import { db } from "@/lib/db";
import { 
  withApiHandler, 
  apiSuccess, 
  validateBody, 
  requireTenant,
  ConflictError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  TenantRoles
} from "@/lib/api-framework";
import { createOrderSchema } from "@/lib/validations/order";
import { CustomerService } from "@/services/CustomerService";
import { RateLimitPolicies } from "@/lib/rate-limiting/RateLimitPolicies";
import { NextRequest } from "next/server";

export const POST = withApiHandler(
  async (req: NextRequest, ctx) => {
    // 2. Tenant Resolution & Validation
    const restaurantId = requireTenant(ctx.user);
    const body = await validateBody(req, createOrderSchema);

    // 3. Fetch all requested dishes to verify they exist and belong to the tenant
    const dishIds = body.items.map(item => item.dishId);
    const dishes = await db.dish.findMany({
      where: {
        id: { in: dishIds },
        category: { restaurantId }, // Enforces tenant isolation
      }
    });

    // Check if any dishes were missing or cross-tenant
    const existingDishIds = new Set(dishes.map(d => d.id));
    const missingDishIds = dishIds.filter(id => !existingDishIds.has(id));
    
    if (missingDishIds.length > 0) {
      throw new NotFoundError(`One or more dishes not found or do not belong to your restaurant: ${missingDishIds.join(", ")}`);
    }

    const dishMap = new Map(dishes.map(d => [d.id, d]));

    // 4. Server-Side Price Calculation & Availability Verification
    let orderTotal = 0;
    const finalItems = body.items.map(item => {
      const dish = dishMap.get(item.dishId)!;
      
      // Verify Availability
      if (!dish.isAvailable) {
        throw new ConflictError(`Dish ${dish.name} is currently unavailable`);
      }

      // Parse authentic dish addons from DB
      let dbAddons: { name: string; price: number }[] = [];
      try {
        dbAddons = JSON.parse(dish.addons);
      } catch (e) {
        // Fallback to empty if DB has corrupted JSON
      }

      // Match requested addons with DB addons to get authentic server-side prices
      const validAddons = item.addons.map(requestedAddon => {
        const authenticAddon = dbAddons.find(a => a.name === requestedAddon.name);
        if (!authenticAddon) {
          throw new ValidationError(`Invalid addon '${requestedAddon.name}' for dish '${dish.name}'`);
        }
        return authenticAddon;
      });

      // Calculate unit price based ONLY on server-side values
      const addonsPrice = validAddons.reduce((sum, a) => sum + a.price, 0);
      const unitPrice = dish.price + addonsPrice;
      const itemTotal = unitPrice * item.quantity;
      
      orderTotal += itemTotal;

      return {
        dishId: dish.id,
        quantity: item.quantity,
        unitPrice, 
        addons: JSON.stringify(validAddons),
      };
    });

    // 5. Database Transaction (Atomic Order Creation & Inventory Update)
    const order = await db.$transaction(async (tx) => {
      // Link customer if provided
      let customerId: string | null = null;
      if (body.customerPhone && body.customerName) {
        const customer = await CustomerService.upsertCustomer(
          tx,
          restaurantId,
          body.customerPhone,
          body.customerName.replace(/<[^>]*>/g, '').substring(0, 100)
        );
        customerId = customer.id;
      }

      const createdOrder = await tx.order.create({
        data: {
          restaurantId,
          customerId,
          total: orderTotal, // Fully calculated on server
          tableNumber: body.tableNumber ?? null,
          customerName: body.customerName ? body.customerName.replace(/<[^>]*>/g, '').substring(0, 100) : null, // Sanitize
          status: "pending",
          items: {
            create: finalItems.map(item => ({
              dishId: item.dishId,
              quantity: item.quantity,
              price: item.unitPrice, 
              addons: item.addons,
            }))
          }
        },
        include: { items: true }
      });

      // Update order counts for popularity tracking
      for (const item of finalItems) {
        await tx.dish.update({
          where: { id: item.dishId },
          data: { orderCount: { increment: item.quantity } }
        });
      }

      if (customerId) {
        await CustomerService.logOrderCreated(tx, customerId, restaurantId, createdOrder.id, orderTotal);
      }

      return createdOrder;
    });

    return apiSuccess({ order }, 201);
  },
  { 
    requireAuth: true,
    allowedRoles: [TenantRoles.OWNER, TenantRoles.MANAGER, TenantRoles.EMPLOYEE],
    rateLimit: RateLimitPolicies.CRITICAL_OPERATIONS
  }
);