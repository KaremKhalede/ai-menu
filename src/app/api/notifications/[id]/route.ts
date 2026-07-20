import { 
  withApiHandler, 
  apiSuccess, 
  requireTenant,
  TenantRoles,
  NotFoundError
} from "@/lib/api-framework";
import { NotificationService } from "@/services/NotificationService";
import { NextRequest } from "next/server";

export const GET = withApiHandler(
  async (req: NextRequest, ctx) => {
    const restaurantId = requireTenant(ctx.user);
    const notificationId = ctx.params.id;

    const notification = await NotificationService.getNotificationById(restaurantId, notificationId);
    
    if (!notification) {
      throw new NotFoundError("Notification not found");
    }

    return apiSuccess({ notification });
  },
  { 
    requireAuth: true,
    allowedRoles: [TenantRoles.OWNER, TenantRoles.MANAGER, TenantRoles.EMPLOYEE] 
  }
);
