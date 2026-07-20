import { SystemInstruction } from '../types';
import { DecisionModel } from '../cognitive/DecisionEngine';

export class AiReasoningEngine {
  /**
   * Deterministically synthesizes the final SystemInstruction by assembling:
   * Persona -> Restaurant Knowledge -> Customer Memory -> Cognitive Decisions -> Validation.
   * Tracks metrics such as assembly time and character counts.
   */
  public synthesizeSystemInstruction(
    tenantId: string,
    menuKnowledge: string,
    promotionsKnowledge: string,
    customerMemory: string,
    decisionModel: DecisionModel,
    validationRules: string[]
  ): { instruction: SystemInstruction; metrics: any } {
    const startTime = performance.now();

    const persona = `
You are Mohammed, an experienced, highly hospitable restaurant waiter.
Your tone is warm, friendly, confident, and effortless. You speak simple, clear Arabic or English, and seamlessly auto-detect the customer's language.

CORE RULES:
1. Absolute Minimalism: Answer with the absolute minimum amount of information required. Never over-explain.
2. The Ping-Pong Rule: Keep your answers between 1 and 3 short sentences. 
3. Dynamic Conversation Modes:
   - If the customer asks a short question, answer quickly with zero fluff.
   - If the customer asks for a recommendation, ask ONE guiding question to narrow it down (e.g. "Do you feel like beef or chicken?"). Never list more than two items.
   - If the customer decides, stop selling and close the order.
4. Voice Mechanics: Do NOT use asterisks, emojis, or markdown. Use natural punctuation (commas, periods) to create realistic pauses.
5. Do NOT say "As an AI...". You are an experienced waiter who has served thousands of customers.

Business Logic Rule: You are stateless. If you recommend something, act confident. Do not try to execute functions yet.
    `.trim();

    // Format Cognitive Directives
    let cognitiveContext = `## COGNITIVE DIRECTIVES & DECISION MODEL\n`;
    cognitiveContext += `Your primary business objectives are: ${decisionModel.businessObjectives.join(', ')}.\n\n`;
    
    cognitiveContext += `### STATE MACHINE (INTENT TAXONOMY)\n`;
    cognitiveContext += `You must classify the customer's state and follow these rules:\n`;
    for (const intent of decisionModel.activeIntents) {
      cognitiveContext += `- [${intent.intent}]: ${intent.description} -> RULES: ${intent.rules.join(' | ')}\n`;
    }

    cognitiveContext += `\n### RECOMMENDATION CONSTRAINTS\n`;
    if (decisionModel.recommendationConstraints.primaryCandidate) {
      const pc = decisionModel.recommendationConstraints.primaryCandidate;
      cognitiveContext += `If recommending, your PRIMARY target is [${pc.recommendation}]. REASON: ${pc.reason} (Source: ${pc.source}, Confidence: ${pc.confidence}).\n`;
    }
    if (decisionModel.recommendationConstraints.secondaryCandidate) {
      const sc = decisionModel.recommendationConstraints.secondaryCandidate;
      cognitiveContext += `Your SECONDARY target is [${sc.recommendation}]. REASON: ${sc.reason} (Source: ${sc.source}, Confidence: ${sc.confidence}).\n`;
    }
    cognitiveContext += `Never recommend more than ${decisionModel.recommendationConstraints.maxItemsToRecommend} items.\n`;

    // Format Validation Rules
    const validationContext = `## RESPONSE VALIDATION GATES\n` + validationRules.map(r => `- ${r}`).join('\n');

    // Deterministic Assembly
    const finalPrompt = `
${persona}

---
${validationContext}

---
${cognitiveContext}

---
${menuKnowledge}

---
${promotionsKnowledge}

---
${customerMemory}
    `.trim();

    const generationTimeMs = performance.now() - startTime;
    const charCount = finalPrompt.length;
    // Rough estimate: 1 token ~= 4 characters in English
    const estimatedTokens = Math.ceil(charCount / 4);

    return {
      instruction: {
        role: 'system',
        content: finalPrompt,
      },
      metrics: {
        generationTimeMs,
        charCount,
        estimatedTokens
      }
    };
  }
}

