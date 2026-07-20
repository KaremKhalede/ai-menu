import { 
  withApiHandler, 
  apiSuccess, 
  requireTenant,
  TenantRoles,
  validateBody,
  ValidationError
} from "@/lib/api-framework";
import { evaluatePricingSchema } from "@/lib/validations/pricing";
import { PricingService } from "@/services/PricingService";
import { StandardTaxProvider } from "@/lib/providers/TaxProvider";
import { NextRequest } from "next/server";

export const POST = withApiHandler(
  async (req: NextRequest, ctx) => {
    const restaurantId = requireTenant(ctx.user);
    const body = await validateBody(req, evaluatePricingSchema);

    // Initialize the pricing engine with our abstracted Tax Provider
    const taxProvider = new StandardTaxProvider();
    const pricingService = new PricingService(taxProvider);

    try {
      // Evaluate strictly without mutations
      const result = await pricingService.evaluate(body.items);
      return apiSuccess(result, null, 200);
    } catch (error: any) {
      throw new ValidationError(error.message);
    }
  },
  { 
    requireAuth: true,
    // Allowed for backend operations and POS
    allowedRoles: [TenantRoles.OWNER, TenantRoles.MANAGER, TenantRoles.EMPLOYEE] 
  }
);
