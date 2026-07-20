import { db } from "@/lib/db";
import { 
  withApiHandler, 
  apiSuccess, 
  validateBody, 
  tenantWhere,
  TenantRoles,
  NotFoundError
} from "@/lib/api-framework";
import { createDishSchema } from "@/lib/validations/menu";

export const GET = withApiHandler(
  async (req, ctx) => {
    const dishes = await db.dish.findMany({
      where: {
        category: tenantWhere(ctx.user),
        // Design note for future soft-delete support: 
        // e.g., isDeleted: false
      },
      orderBy: { createdAt: 'desc' },
      include: {
        category: {
          select: { name: true, nameEn: true },
        },
      },
    });
    
    return apiSuccess({ dishes });
  },
  { requireAuth: true }
);

export const POST = withApiHandler(
  async (req, ctx) => {
    const body = await validateBody(req, createDishSchema);

    // Verify category exists and belongs to current tenant
    const category = await db.category.findFirst({
      where: {
        id: body.categoryId,
        ...tenantWhere(ctx.user),
      },
    });

    if (!category) {
      throw new NotFoundError("Category not found or does not belong to your restaurant");
    }

    const dish = await db.dish.create({
      data: body,
    });

    return apiSuccess({ dish }, 201);
  },
  { 
    requireAuth: true, 
    allowedRoles: [TenantRoles.OWNER, TenantRoles.MANAGER] 
  }
);
