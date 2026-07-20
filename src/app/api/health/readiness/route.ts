import { NextResponse } from "next/server";
import { HealthManager } from "@/lib/health/HealthManager";
import { DatabaseHealthIndicator } from "@/lib/health/DatabaseHealthIndicator";
import { CacheHealthIndicator } from "@/lib/health/CacheHealthIndicator";
import { HealthStatus } from "@/lib/health/HealthTypes";

// Register indicators once (usually done in an initializer/bootstrap phase)
let registered = false;
if (!registered) {
  HealthManager.register(new DatabaseHealthIndicator());
  HealthManager.register(new CacheHealthIndicator());
  registered = true;
}

export async function GET() {
  const report = await HealthManager.readiness();
  
  const statusCode = report.status === HealthStatus.UNHEALTHY ? 503 : 200;
  
  return NextResponse.json(report, { status: statusCode });
}
