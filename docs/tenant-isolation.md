# Tenant Isolation Foundation

This document outlines the tenant isolation model used in the Servio AI backend.
All business APIs (Menus, Orders, Analytics, CRM, etc.) must strictly adhere to this model to prevent cross-tenant data leaks.

## 1. How Tenant Context is Resolved

The tenant context is **exclusively resolved from the authenticated user's session**.
We NEVER trust a `restaurantId` provided by the client in the request body, query parameters, or headers.

When an API route is protected with `withApiHandler({ requireAuth: true })`, the `ctx.user` object is guaranteed to be populated. The helper function `requireTenant(ctx.user)` securely extracts the `restaurantId` that the user belongs to. If the user does not belong to a restaurant, it throws a `ForbiddenError`.

## 2. How New APIs Should Query Data

Every Prisma database query must be scoped to the resolved tenant. To avoid repeating `where: { restaurantId: user.restaurantId }`, use the reusable `tenantWhere` helper.

### Recommended Patterns ✅

**Fetching lists:**
```typescript
const dishes = await db.dish.findMany({
  where: tenantWhere(ctx.user, { isAvailable: true })
});
```

**Fetching a single record by ID:**
```typescript
const order = await db.order.findFirst({
  where: tenantWhere(ctx.user, { id: params.orderId })
});
```
*Note: Always use `findFirst` instead of `findUnique` when enforcing a tenant scope, because `tenantWhere` adds `restaurantId` which makes the where clause non-unique.*

**Creating records:**
```typescript
const category = await db.category.create({
  data: {
    ...body,
    restaurantId: requireTenant(ctx.user) // Securely attach the tenant ID
  }
});
```

**Role-based Authorization:**
```typescript
// Only managers and owners can access this logic
requireTenantRole(ctx.user, [TenantRoles.OWNER, TenantRoles.MANAGER]);
```

### Forbidden Patterns ❌

**1. Trusting client payloads:**
```typescript
// ❌ DANGER: A malicious user could pass someone else's restaurantId
await db.category.create({ data: { ...body } }); // body contains restaurantId
```

**2. Querying without tenant scope:**
```typescript
// ❌ DANGER: Might return data belonging to another restaurant
const order = await db.order.findUnique({ where: { id: params.orderId } });
```

**3. Manually checking restaurant IDs repeatedly:**
```typescript
// ❌ BAD: Repetitive and error-prone
const dishes = await db.dish.findMany({
  where: { restaurantId: ctx.user.restaurantId, isAvailable: true }
});
```

## 3. Future Migration Strategy

Currently, no existing endpoints (Menus, Orders, Analytics) have been migrated to this pattern. The migration strategy will be:
1. Incrementally replace manual `user.restaurantId` checks with `requireTenant(ctx.user)`.
2. Refactor Prisma queries to use `tenantWhere(ctx.user, {...})`.
3. Switch `findUnique` queries to `findFirst` when `restaurantId` is included in the condition.
4. Replace raw string role checks with `TenantRoles` constants and `requireTenantRole`.
5. Remove any endpoints that accept `restaurantId` from the client body/query and replace them with server-resolved context.
