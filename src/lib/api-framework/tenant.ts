import { AuthenticatedUser } from '@/lib/auth-helper';
import { ForbiddenError, UnauthorizedError } from './errors';

/**
 * Valid roles within a tenant (restaurant).
 */
export const TenantRoles = {
  OWNER: 'owner',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
} as const;

export type TenantRole = typeof TenantRoles[keyof typeof TenantRoles];

/**
 * 1. Safely resolves the current tenant (restaurantId) from the authenticated user.
 * It NEVER trusts a restaurantId provided by the client.
 */
export function requireTenant(user?: AuthenticatedUser): string {
  if (!user) {
    throw new UnauthorizedError('يجب تسجيل الدخول');
  }
  if (!user.restaurantId) {
    throw new ForbiddenError('هذا الحساب غير مرتبط بمطعم، يرجى إكمال إعداد المطعم.');
  }
  return user.restaurantId;
}

/**
 * 2. Reusable Prisma helper for tenant-aware queries.
 * Merges the resolved tenant ID into a Prisma where clause.
 * 
 * @example
 * prisma.dish.findMany({ where: tenantWhere(user, { isAvailable: true }) })
 */
export function tenantWhere<T extends Record<string, any>>(user: AuthenticatedUser | undefined, where: T = {} as T) {
  const restaurantId = requireTenant(user);
  return {
    ...where,
    restaurantId,
  };
}

/**
 * 3. Reusable authorization helpers for tenant roles.
 */
export function hasTenantRole(user: AuthenticatedUser | undefined, allowedRoles: TenantRole[]): boolean {
  if (!user || !user.role) return false;
  return allowedRoles.includes(user.role as TenantRole);
}

export function requireTenantRole(user: AuthenticatedUser | undefined, allowedRoles: TenantRole[]): void {
  requireTenant(user); // Ensure they belong to a tenant first
  if (!hasTenantRole(user, allowedRoles)) {
    throw new ForbiddenError('صلاحيات غير كافية، يرجى مراجعة مدير المطعم.');
  }
}
