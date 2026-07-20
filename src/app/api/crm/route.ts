import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser, authorizeRoles } from '@/lib/auth-helper';
import {
  demoCustomers,
  demoCampaigns,
  getCRMAnalytics,
} from '@/lib/crm-engine';

export async function GET(req: NextRequest) {
  // Authentication & Authorization Check
  const user = await getSessionUser(req);
  if (!user) {
    return NextResponse.json(
      { success: false, message: 'غير مصرح للوصول إلى هذه البيانات' },
      { status: 401 }
    );
  }

  if (!authorizeRoles(user, ['owner', 'manager'])) {
    return NextResponse.json(
      { success: false, message: 'صلاحيات غير كافية' },
      { status: 403 }
    );
  }

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