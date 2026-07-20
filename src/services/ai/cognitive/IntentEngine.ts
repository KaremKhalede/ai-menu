export enum ConversationIntent {
  EXPLORING = "EXPLORING",
  COMPARING = "COMPARING",
  DECIDED = "DECIDED",
  RUSHED = "RUSHED",
  SUPPORT = "SUPPORT" // e.g., questions outside restaurant knowledge
}

export class IntentEngine {
  /**
   * The IntentEngine owns the conversation state taxonomy and behavioral rules.
   * Since we use an Ephemeral WebRTC architecture, the LLM actively infers the 
   * current state during the audio stream. This engine provides the strict 
   * definitions and rules the LLM must follow for each state.
   */
  public getIntentTaxonomy() {
    return [
      {
        intent: ConversationIntent.EXPLORING,
        description: "Customer is asking general questions, looking for options.",
        rules: ["Ask one guiding question to narrow options.", "Do not list more than 2 items."]
      },
      {
        intent: ConversationIntent.COMPARING,
        description: "Customer is debating between specific items.",
        rules: ["Highlight the primary difference (e.g. spice, size).", "Recommend the one that fits their known preferences."]
      },
      {
        intent: ConversationIntent.DECIDED,
        description: "Customer knows what they want or has confirmed an item.",
        rules: ["Stop selling.", "Confirm the choice quickly.", "Move towards closing the order."]
      },
      {
        intent: ConversationIntent.RUSHED,
        description: "Customer is in a hurry or gives very short answers.",
        rules: ["Skip all conversational pleasantries.", "Execute actions immediately.", "Use maximum 1 sentence."]
      },
      {
        intent: ConversationIntent.SUPPORT,
        description: "Customer asks about non-food items (e.g., parking, hours, or unrelated topics).",
        rules: ["Answer briefly if within restaurant knowledge.", "If outside knowledge, gracefully admit ignorance."]
      }
    ];
  }
}
