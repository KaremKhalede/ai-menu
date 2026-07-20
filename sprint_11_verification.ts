import { ToolCallingEngine } from "./src/services/ai/tools/ToolCallingEngine";

async function runVerification() {
  const engine = new ToolCallingEngine();
  const tenantId = "restaurant_123";
  const sessionId = "session_abc";
  const customerId = "customer_xyz";

  console.log("=== SPRINT 11 VERIFICATION ===");

  // Scenario 1: Invalid dish ID
  console.log("\nScenario 1: Invalid dish ID");
  const res1 = await engine.executeTool(tenantId, sessionId, customerId, "add_to_cart", { dishId: "invalid_999", quantity: 1 });
  console.log("Result:", res1);

  // Scenario 2: Quantity exceeds maximum
  console.log("\nScenario 2: Quantity exceeds maximum");
  const res2 = await engine.executeTool(tenantId, sessionId, customerId, "add_to_cart", { dishId: "valid_dish", quantity: 50 });
  console.log("Result:", res2);

  // Scenario 3: Expired session
  console.log("\nScenario 3: Expired session");
  const res3 = await engine.executeTool(tenantId, "", customerId, "add_to_cart", { dishId: "valid_dish", quantity: 1 });
  console.log("Result:", res3);

  // Scenario 4: Unauthorized checkout
  console.log("\nScenario 4: Unauthorized checkout");
  const res4 = await engine.executeTool(tenantId, sessionId, undefined, "checkout", {});
  console.log("Result:", res4);

  // Scenario 5: Cross-tenant request
  console.log("\nScenario 5: Cross-tenant request");
  const res5 = await engine.executeTool(tenantId, sessionId, customerId, "add_to_cart", { dishId: "valid_dish", quantity: 1, restaurantId: "hacker_tenant" });
  console.log("Result:", res5);

  // Scenario 6: Duplicate add-to-cart request
  console.log("\nScenario 6: Duplicate add-to-cart request");
  const res6_a = await engine.executeTool(tenantId, sessionId, customerId, "add_to_cart", { dishId: "duplicate_dish", quantity: 1 });
  const res6_b = await engine.executeTool(tenantId, sessionId, customerId, "add_to_cart", { dishId: "duplicate_dish", quantity: 1 });
  console.log("Result A (Expected to fail if invalid dish or succeed if valid, but B should block replay):", res6_a);
  console.log("Result B:", res6_b);
}

runVerification().catch(console.error);
