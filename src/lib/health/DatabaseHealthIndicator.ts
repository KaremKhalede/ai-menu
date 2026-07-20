import { db } from "@/lib/db";
import { HealthIndicator } from "./HealthTypes";

export class DatabaseHealthIndicator implements HealthIndicator {
  public readonly name = "Database";
  public readonly isCritical = true;
  public readonly timeoutMs = 3000; // 3 seconds timeout

  async check(): Promise<Record<string, any>> {
    // A simple lightweight query to verify connectivity
    await db.$queryRaw`SELECT 1`;
    return { provider: "sqlite" };
  }
}
