/**
 * modules/crm — public API
 *
 * Exporting page entry point and targeted sub-components.
 */

/* ── Page (primary entry point) ── */
export { default as CRMDashboardPage } from './pages/CRMDashboardPage';

/* ── Hooks ── */
export { useCustomers } from './hooks/useCustomers';
export { useCampaignForm } from './hooks/useCampaignForm';

/* ── Components ── */
export { WhatsAppPreview } from './components/WhatsAppPreview';
export { KPICard } from './components/KPICard';
export { CustomerDetail } from './components/CustomerDetail';
export { CustomersTab } from './components/CustomersTab';
export { CampaignsTab } from './components/CampaignsTab';
export { CreateCampaignDialog } from './components/CreateCampaignDialog';
export { AnalyticsTab } from './components/AnalyticsTab';

/* ── Types ── */
export type {
  Customer,
  Campaign,
  CampaignOffer,
  CampaignROI,
  CRMAnalytics,
  TargetSegment,
  CampaignTemplateKey,
  CampaignTemplate,
  CustomerInsight,
} from './types';
