import { db } from "@/lib/db";
import { 
  withApiHandler, 
  apiSuccess, 
  tenantWhere,
  TenantRoles,
  NotFoundError,
  ConflictError,
  validateBody
} from "@/lib/api-framework";
import { updateOrderStatusSchema } from "@/lib/validations/orders";
import { CustomerService } from "@/services/CustomerService";
import { LoyaltyService } from "@/services/LoyaltyService";

// Valid State Transitions
const validTransitions: Record<string, string[]> = {
  pending: ["preparing", "cancelled"],
  preparing: ["ready", "cancelled"],
  ready: ["completed"],
  completed: [], // Terminal state
  cancelled: [], // Terminal state
};

export const PATCH = withApiHandler(
  async (req, ctx) => {
    const id = ctx.params.id;
    const body = await validateBody(req, updateOrderStatusSchema);

    // Verify order exists and belongs to tenant
    const order = await db.order.findFirst({
      where: {
        id,
        ...tenantWhere(ctx.user),
      },
    });

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    const currentStatus = order.status;
    const nextStatus = body.status;

    // Validate lifecycle transition
    const allowedNextStatuses = validTransitions[currentStatus] || [];
    
    if (!allowedNextStatuses.includes(nextStatus)) {
      throw new ConflictError(
        `Invalid status transition: Cannot move order from '${currentStatus}' to '${nextStatus}'.`
      );
    }

    // Apply the transition within a transaction to safely update stats
    const updatedOrder = await db.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id },
        data: { status: nextStatus },
      });

      if (order.customerId) {
        if (nextStatus === "completed") {
          await CustomerService.updateStatsAfterCompletion(
            tx,
            order.customerId,
            order.restaurantId,
            order.id,
            order.total,
            updated.updatedAt
          );

          await LoyaltyService.awardPointsForOrder(
            tx,
            order.customerId,
            order.restaurantId,
            order.id,
            order.total
          );
        } else if (nextStatus === "cancelled") {
          await CustomerService.logOrderCancelled(
            tx,
            order.customerId,
            order.restaurantId,
            order.id,
            "تم الإلغاء من قبل لوحة التحكم"
          );
        }
      }

      return updated;
    });

    return apiSuccess({ order: updatedOrder });
  },
  { 
    requireAuth: true,
    // Employees are read-only for orders according to business rules
    allowedRoles: [TenantRoles.OWNER, TenantRoles.MANAGER] 
  }
);
