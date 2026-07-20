import { z } from 'zod';
import { db } from '@/lib/db';
import { 
  withApiHandler, 
  validateBody, 
  apiSuccess, 
  ConflictError,
  InternalServerError
} from '@/lib/api-framework';

const createRestaurantSchema = z.object({
  name: z.string().min(1, 'اسم المطعم مطلوب').max(100),
  nameEn: z.string().max(100).optional().nullable(),
  description: z.string().max(500).optional().nullable(),
  logo: z.string().url('رابط الشعار غير صالح').optional().nullable(),
  theme: z.string().optional().default('luxury'),
  currency: z.string().optional().default('SAR'),
});

export const POST = withApiHandler(
  async (req, ctx) => {
    const user = ctx.user!;

    // 1. Idempotency Check: User must NOT already belong to another restaurant
    if (user.restaurantId) {
      throw new ConflictError('المستخدم مرتبط بمطعم بالفعل. لا يمكن إنشاء أكثر من مطعم.');
    }

    // Validate request payload
    const data = await validateBody(req, createRestaurantSchema);

    // 2. Database Transaction: Atomic Onboarding
    try {
      const result = await db.$transaction(async (tx) => {
        // Step A: Create the Restaurant
        const restaurant = await tx.restaurant.create({
          data: {
            name: data.name,
            nameEn: data.nameEn,
            description: data.description,
            logo: data.logo,
            theme: data.theme,
            currency: data.currency,
          },
        });

        // Step B: Update the User (assign restaurant, set role to owner, mark as onboarded)
        const updatedUser = await tx.user.update({
          where: { id: user.id },
          data: {
            restaurantId: restaurant.id,
            role: 'owner',
            isOnboarded: true,
          },
        });

        return { restaurant, user: updatedUser };
      });

      // 3. Return the completed onboarding result
      return apiSuccess(result, undefined, 201);
    } catch (error) {
      // In case of transaction failure, Prisma throws an error and rolls back everything.
      console.error('[Onboarding Transaction Error]', error);
      throw new InternalServerError('فشلت عملية الإعداد، يرجى المحاولة مرة أخرى.');
    }
  },
  { requireAuth: true }
);
