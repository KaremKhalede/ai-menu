import { db } from "@/lib/db";
import { 
  withApiHandler, 
  apiSuccess, 
  tenantWhere,
  TenantRoles
} from "@/lib/api-framework";

export const GET = withApiHandler(
  async (req, ctx) => {
    // URL Search params for basic filtering (e.g., ?status=pending)
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");

    const whereClause: any = tenantWhere(ctx.user);
    if (statusFilter) {
      whereClause.status = statusFilter;
    }

    const orders = await db.order.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            dish: {
              select: { name: true, nameEn: true }
            }
          }
        }
      }
    });

    return apiSuccess({ orders });
  },
  { 
    requireAuth: true,
    allowedRoles: [TenantRoles.OWNER, TenantRoles.MANAGER, TenantRoles.EMPLOYEE] 
  }
);
