import { SafetyPolicyEngine } from "./SafetyPolicyEngine";
import { BusinessRulesEngine } from "./BusinessRulesEngine";
import { CartService } from "@/services/CartService";
import { AiMonitoringEngine } from "@/services/ai/analytics/AiMonitoringEngine";

export class ToolCallingEngine {
  private safetyEngine: SafetyPolicyEngine;
  private rulesEngine: BusinessRulesEngine;
  private monitoringEngine: AiMonitoringEngine;

  constructor() {
    this.safetyEngine = new SafetyPolicyEngine();
    this.rulesEngine = new BusinessRulesEngine();
    this.monitoringEngine = new AiMonitoringEngine();
  }

  /**
   * Returns the array of Tool Schemas to inject into the OpenAI connection.
   */
  public getAvailableTools() {
    return [
      {
        type: "function",
        name: "add_to_cart",
        description: "Adds a specified quantity of a dish to the customer's cart.",
        parameters: {
          type: "object",
          properties: {
            dishId: { type: "string", description: "The ID of the dish to add." },
            quantity: { type: "integer", description: "The number of items to add." }
          },
          required: ["dishId", "quantity"]
        }
      },
      {
        type: "function",
        name: "view_cart",
        description: "Retrieves the current contents of the customer's cart.",
        parameters: { type: "object", properties: {} }
      },
      {
        type: "function",
        name: "checkout",
        description: "Initiates the checkout process for the active cart.",
        parameters: { type: "object", properties: {} }
      }
    ];
  }

  /**
   * Executes a tool dynamically.
   * Flow: Safety Gate -> Business Rules Gate -> Backend Service (CartService)
   */
  public async executeTool(
    tenantId: string, 
    sessionId: string, 
    customerId: string | undefined,
    actionName: string, 
    args: any
  ): Promise<any> {
    const startTime = Date.now();
    try {
      // 1. Safety & Policy Gateway
      this.safetyEngine.validateAction({
        tenantId,
        sessionId,
        isAuthenticated: !!customerId,
        actionName
      }, args);

      let result;
      // 2. Map capabilities to Backend
      switch (actionName) {
        case "add_to_cart":
          result = await this.handleAddToCart(tenantId, sessionId, customerId, args.dishId, args.quantity);
          break;
        case "view_cart":
          result = await CartService.getCart(sessionId, tenantId, customerId);
          break;
        case "checkout":
          // Checkout logic delegates to OrderService internally in a real scenario
          result = { status: "CHECKOUT_INITIATED", message: "Please proceed to the counter to pay." };
          break;
        default:
          throw new Error(`UNKNOWN_TOOL: ${actionName}`);
      }
      
      this.monitoringEngine.logToolExecuted(tenantId, sessionId, "voice", actionName, true, {
        latencyMs: Date.now() - startTime,
        conversionType: actionName === "add_to_cart" ? "ADD_TO_CART" : (actionName === "checkout" ? "CHECKOUT" : "INFO")
      });

      return result;
    } catch (error: any) {
      this.monitoringEngine.logToolExecuted(tenantId, sessionId, "voice", actionName, false, {
        latencyMs: Date.now() - startTime,
        errorReason: error.message
      });
      // If a rule blocks execution, we return the error gracefully to the LLM
      return { error: error.message };
    }
  }

  private async handleAddToCart(tenantId: string, sessionId: string, customerId: string | undefined, dishId: string, quantity: number) {
    // Business Rule Gate: Does the dish exist and is it available?
    const fact = await this.rulesEngine.evaluateDishAvailability(tenantId, dishId);
    
    if (!fact.exists) {
      throw new Error("BUSINESS_RULE_VIOLATION: Invalid dish ID.");
    }
    
    if (!fact.isAvailable) {
      throw new Error("BUSINESS_RULE_VIOLATION: Item is currently out of stock.");
    }

    // Backend Execution
    return await CartService.addItem(sessionId, tenantId, {
      dishId,
      name: fact.name,
      quantity,
      price: fact.price
    }, customerId);
  }
}
