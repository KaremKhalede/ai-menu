export interface RecommendationCandidate {
  recommendation: string; // The dish name
  reason: string;
  confidence: number; // 0.0 to 1.0
  source: 'Best Seller' | 'Chef Special' | 'Promotion' | 'Customer Preference' | 'Similar Customers';
}

export class RecommendationEngine {
  /**
   * Deterministically generates a list of curated recommendations
   * BEFORE the AI session starts, grounding the LLM in real business data.
   */
  public generateCandidates(menuKnowledge: string, customerMemory: string): RecommendationCandidate[] {
    const candidates: RecommendationCandidate[] = [];

    // In a real implementation, this would parse the actual DB records, 
    // but for our Knowledge pipeline, we extract it from the hydrated contexts.
    // For now, we simulate the deterministic generation based on the data.
    
    // Example: If it's a new customer, suggest the Best Seller
    if (customerMemory.includes("New Customer") || customerMemory.includes("Guest")) {
      candidates.push({
        recommendation: "Signature Truffle Burger",
        reason: "Highest conversion rate for first-time customers",
        confidence: 0.95,
        source: "Best Seller"
      });
    }

    // Example: If it's a Regular, suggest something based on preference
    if (customerMemory.includes("Regular")) {
      candidates.push({
        recommendation: "Spicy Wagyu Ribeye",
        reason: "Customer frequently orders spicy items",
        confidence: 0.88,
        source: "Customer Preference"
      });
    }

    // Always include a high-margin Chef Special fallback
    candidates.push({
      recommendation: "Saffron Risotto",
      reason: "High margin, currently featured by the Chef",
      confidence: 0.75,
      source: "Chef Special"
    });

    return candidates;
  }
}
