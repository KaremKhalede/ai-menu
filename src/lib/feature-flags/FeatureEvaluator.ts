import { FeatureFlagDefinition } from "./FeatureFlagProvider";
import { FeatureContext } from "./FeatureContext";

export class FeatureEvaluator {
  /**
   * Deterministically evaluates the list of flag definitions (tenant + global)
   * against the provided context.
   */
  static evaluate(definitions: FeatureFlagDefinition[], context: FeatureContext): boolean {
    if (!definitions || definitions.length === 0) return false;

    // 1. Select the most specific definition (Tenant override > Global)
    let def = definitions.find(d => d.tenantId === context.tenantId);
    if (!def) {
      def = definitions.find(d => d.tenantId === null);
    }
    
    // If no applicable definition is found
    if (!def) return false;

    // 2. Base enabled check
    if (!def.enabled) return false;

    // 3. Custom JSON conditions (e.g., specific allowlists)
    if (def.conditions && Object.keys(def.conditions).length > 0) {
      const passesConditions = this.evaluateConditions(def.conditions, context);
      if (!passesConditions) return false;
    }

    // 4. Deterministic Percentage Rollout
    if (def.rolloutPercentage !== null && def.rolloutPercentage !== undefined) {
      const identifier = context.userId || context.tenantId || "anonymous";
      const bucket = this.hashStringToInt(def.flagKey + identifier) % 100;
      if (bucket >= def.rolloutPercentage) {
        return false;
      }
    }

    return true;
  }

  /**
   * Simple string hash (FNV-1a like) to ensure consistent bucket assignment
   */
  private static hashStringToInt(str: string): number {
    let hash = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return Math.abs(hash);
  }

  private static evaluateConditions(conditions: any, context: FeatureContext): boolean {
    // Simple exact match logic for MVP
    for (const [key, expectedValue] of Object.entries(conditions)) {
      let contextValue: any = undefined;

      if (key === "tenantId") contextValue = context.tenantId;
      else if (key === "userId") contextValue = context.userId;
      else contextValue = context.metadata[key];

      if (contextValue !== expectedValue) {
        return false;
      }
    }
    return true;
  }
}
