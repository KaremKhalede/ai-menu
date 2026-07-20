import { db } from "@/lib/db";
import { 
  withApiHandler, 
  apiSuccess, 
  validateBody, 
  tenantWhere,
  TenantRoles,
  NotFoundError
} from "@/lib/api-framework";
import { updateDishSchema } from "@/lib/validations/menu";

export const PUT = withApiHandler(
  async (req, ctx) => {
    const id = ctx.params.id;
    const body = await validateBody(req, updateDishSchema);

    // Verify dish exists and belongs to the tenant
    const existing = await db.dish.findFirst({
      where: {
        id,
        category: tenantWhere(ctx.user),
      },
    });

    if (!existing) {
      throw new NotFoundError("Dish not found");
    }

    // If changing category, verify the NEW category exists and belongs to the tenant
    if (body.categoryId && body.categoryId !== existing.categoryId) {
      const category = await db.category.findFirst({
        where: {
          id: body.categoryId,
          ...tenantWhere(ctx.user),
        },
      });

      if (!category) {
        throw new NotFoundError("Target category not found or does not belong to your restaurant");
      }
    }

    const dish = await db.dish.update({
      where: { id },
      data: body,
    });

    return apiSuccess({ dish });
  },
  { 
    requireAuth: true, 
    allowedRoles: [TenantRoles.OWNER, TenantRoles.MANAGER] 
  }
);

export const DELETE = withApiHandler(
  async (req, ctx) => {
    const id = ctx.params.id;

    // Verify dish exists and belongs to the tenant
    const existing = await db.dish.findFirst({
      where: {
        id,
        category: tenantWhere(ctx.user),
      },
    });

    if (!existing) {
      throw new NotFoundError("Dish not found");
    }

    // Design note for future soft-delete support:
    // Instead of db.dish.delete, we would do:
    // await db.dish.update({ where: { id }, data: { isDeleted: true } })
    
    await db.dish.delete({
      where: { id },
    });

    return apiSuccess({ success: true, message: "Dish deleted successfully" });
  },
  { 
    requireAuth: true, 
    allowedRoles: [TenantRoles.OWNER, TenantRoles.MANAGER] 
  }
);
