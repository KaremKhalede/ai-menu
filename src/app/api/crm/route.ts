import { NextResponse } from 'next/server';
import {
  demoCustomers,
  demoCampaigns,
  getCRMAnalytics,
} from '@/lib/crm-engine';

export async function GET() {
  const analytics = getCRMAnalytics(demoCustomers, demoCampaigns);

  return NextResponse.json({
    customers: demoCustomers.map((c) => ({
      ...c,
      lastOrderDate: c.lastOrderDate.toISOString(),
      createdAt: c.createdAt.toISOString(),
    })),
    campaigns: demoCampaigns.map((c) => ({
      ...c,
      scheduledAt: c.scheduledAt?.toISOString(),
      sentAt: c.sentAt?.toISOString(),
      createdAt: c.createdAt.toISOString(),
    })),
    analytics,
  });
}