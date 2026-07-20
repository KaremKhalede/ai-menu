import { 
  withApiHandler, 
  apiSuccess, 
  requireTenant,
  TenantRoles,
  NotFoundError
} from "@/lib/api-framework";
import { NotificationService } from "@/services/NotificationService";
import { NextRequest } from "next/server";

export const PATCH = withApiHandler(
  async (req: NextRequest, ctx) => {
    const restaurantId = requireTenant(ctx.user);
    const notificationId = ctx.params.id;

    try {
      const notification = await NotificationService.markAsRead(restaurantId, notificationId);
      return apiSuccess({
        ...notification,
        metadata: JSON.parse(notification.metadata)
      });
    } catch (e: any) {
      if (e.message === "Notification not found") {
        throw new NotFoundError(e.message);
      }
      throw e;
    }
  },
  { 
    requireAuth: true,
    allowedRoles: [TenantRoles.OWNER, TenantRoles.MANAGER, TenantRoles.EMPLOYEE] 
  }
);
