import { NextResponse } from 'next/server';
import { TelemetryMonitor } from '@/lib/telemetry/TelemetryMonitor';

export async function GET(request: Request) {
  // Security Layer: Only allow in non-production or with valid admin token
  const authHeader = request.headers.get('authorization');
  const isAdmin = authHeader === `Bearer ${process.env.ADMIN_TELEMETRY_TOKEN}`;
  const isDevOrTest = process.env.NODE_ENV !== 'production';

  if (!isDevOrTest && !isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const monitor = TelemetryMonitor.getInstance();
  return NextResponse.json(monitor.getMetrics());
}
