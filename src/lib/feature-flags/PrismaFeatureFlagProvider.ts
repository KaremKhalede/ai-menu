import { db } from "@/lib/db";
import { FeatureFlagProvider, FeatureFlagDefinition } from "./FeatureFlagProvider";

export class PrismaFeatureFlagProvider implements FeatureFlagProvider {
  async fetchFlagDefinitions(flagKey: string, environment: string): Promise<FeatureFlagDefinition[]> {
    const flags = await db.featureFlag.findMany({
      where: {
        flagKey,
        environment,
      },
    });

    return flags.map(flag => ({
      flagKey: flag.flagKey,
      environment: flag.environment,
      tenantId: flag.tenantId,
      enabled: flag.enabled,
      rolloutPercentage: flag.rolloutPercentage,
      conditions: flag.conditions ? JSON.parse(flag.conditions) : null,
    }));
  }
}
