/**
 * @deprecated
 * This file is a Strangler Pattern shim.
 * The CRM Dashboard feature has been refactored into `src/modules/crm`.
 * This re-export preserves backward compatibility for the dynamic import in
 * `src/app/dashboard/page.tsx` which references `@/components/crm-dashboard`.
 *
 * Do NOT add new code here. Use `@/modules/crm` directly.
 */
export { CRMDashboardPage as default } from '@/modules/crm';
export * from '@/modules/crm';