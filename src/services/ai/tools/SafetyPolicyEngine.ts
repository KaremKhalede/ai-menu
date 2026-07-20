export class SafetyPolicyEngine {
  private recentActions = new Set<string>();

  /**
   * The security gateway for every AI action.
   * Throws explicit errors if safety constraints are violated, blocking backend execution.
   */
  public validateAction(
    actionContext: {
      tenantId: string;
      sessionId: string;
      isAuthenticated: boolean;
      actionName: string;
    },
    args: any
  ) {
    // 1. Session Validity
    if (!actionContext.sessionId) {
      throw new Error("SAFETY_VIOLATION: Expired session.");
    }

    // 2. Authentication bounds
    if (actionContext.actionName === 'checkout' && !actionContext.isAuthenticated) {
      throw new Error("SAFETY_VIOLATION: Unauthorized checkout. Customer must authenticate first.");
    }

    // 5. Cross-tenant bounds
    if (args.restaurantId && args.restaurantId !== actionContext.tenantId) {
      throw new Error("SAFETY_VIOLATION: Cross-tenant manipulation detected.");
    }

    // 3. Input Schema & Parameter bounds
    if (actionContext.actionName === 'add_to_cart') {
      if (!args.dishId || typeof args.quantity !== 'number') {
        throw new Error("SAFETY_VIOLATION: Invalid input schema for add_to_cart.");
      }
      
      if (args.quantity > 20) {
        throw new Error("SAFETY_VIOLATION: Quantity exceeds maximum allowed per transaction.");
      }
      
      if (args.quantity <= 0) {
        throw new Error("SAFETY_VIOLATION: Invalid quantity.");
      }

      // 4. Rate Limiting / Replay Protection (Mocked in-memory for Sprint 11)
      const actionSignature = `${actionContext.sessionId}:${args.dishId}:${args.quantity}`;
      if (this.recentActions.has(actionSignature)) {
        throw new Error("SAFETY_VIOLATION: Duplicate add-to-cart request.");
      }
      this.recentActions.add(actionSignature);
      setTimeout(() => this.recentActions.delete(actionSignature), 2000); // clear after 2 seconds
    }

    return true; // Safe to proceed
  }
}
