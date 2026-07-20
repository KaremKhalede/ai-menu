import { NextResponse } from "next/server";
import { HealthManager } from "@/lib/health/HealthManager";

export async function GET() {
  const report = HealthManager.liveness();
  return NextResponse.json(report, { status: 200 });
}
