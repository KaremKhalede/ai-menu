export interface FeatureFlagDefinition {
  flagKey: string;
  environment: string;
  tenantId: string | null;
  enabled: boolean;
  rolloutPercentage: number | null;
  conditions: any | null; // Parsed JSON
}

export interface FeatureFlagProvider {
  /**
   * Retrieves the raw configuration definitions for a feature flag.
   * Returns an array because there might be a global definition and tenant-specific overrides.
   */
  fetchFlagDefinitions(flagKey: string, environment: string): Promise<FeatureFlagDefinition[]>;
}
