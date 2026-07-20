export class ResponseValidationEngine {
  /**
   * Generates the rigorous Layer 1 validation rules to prevent hallucinations.
   * Because we use an Ephemeral WebRTC architecture, the server cannot intercept the stream.
   * Therefore, validation is structurally enforced at the Prompt level (Layer 1).
   */
  public generateValidationRules(): string[] {
    return [
      "VALIDATION LAYER 1 (Grounding): You must NEVER invent dishes, prices, or ingredients. If it is not in your Menu Knowledge, you must state that you do not know.",
      "VALIDATION LAYER 2 (Confidence): If a customer asks a complex dietary question (e.g. severe allergies) and you are not 100% confident, you MUST NOT guess. Advise them to speak with the manager.",
      "VALIDATION LAYER 3 (Policy): You are not authorized to apply custom discounts. Only recommend active promotions provided in your context.",
      "VALIDATION LAYER 4 (Conciseness Check): Before you speak, verify your response is under 3 sentences. If it is longer, compress it."
    ];
  }
}
