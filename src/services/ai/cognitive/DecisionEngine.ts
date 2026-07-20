import { IntentEngine, ConversationIntent } from "./IntentEngine";
import { RecommendationCandidate } from "./RecommendationEngine";

export interface DecisionModel {
  activeIntents: ReturnType<IntentEngine['getIntentTaxonomy']>;
  recommendationConstraints: {
    maxItemsToRecommend: number;
    primaryCandidate: RecommendationCandidate | null;
    secondaryCandidate: RecommendationCandidate | null;
  };
  businessObjectives: string[];
}

export class DecisionEngine {
  private intentEngine: IntentEngine;

  constructor() {
    this.intentEngine = new IntentEngine();
  }

  /**
   * The DecisionEngine acts as the Arbiter.
   * It takes the Taxonomy and the Candidates, and computes a strict DecisionModel JSON.
   */
  public computeDecisionModel(candidates: RecommendationCandidate[]): DecisionModel {
    // Sort candidates by confidence
    const sortedCandidates = candidates.sort((a, b) => b.confidence - a.confidence);

    return {
      activeIntents: this.intentEngine.getIntentTaxonomy(),
      recommendationConstraints: {
        maxItemsToRecommend: 2, // Hard rule: Never list more than two items
        primaryCandidate: sortedCandidates[0] || null,
        secondaryCandidate: sortedCandidates[1] || null,
      },
      businessObjectives: [
        "Complete the order efficiently",
        "Increase customer confidence",
        "Reduce conversation length",
        "Reduce customer confusion"
      ]
    };
  }
}
