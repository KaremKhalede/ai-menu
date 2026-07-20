/**
 * @deprecated
 * This file is a Strangler Pattern shim.
 * The Dashboard feature has been moved to `src/modules/dashboard`.
 * This re-export preserves backwards-compatibility for the dynamic import in
 * `src/app/dashboard/page.tsx` which still references `@/components/dashboard`.
 *
 * Do NOT add new code here. Use `@/modules/dashboard` directly.
 */
export { DashboardPage as default } from '@/modules/dashboard';