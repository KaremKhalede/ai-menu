import { DomainEventBus, DomainEventType, DomainEvent } from "./src/lib/events/DomainEvent";
import { AiMonitoringEngine } from "./src/services/ai/analytics/AiMonitoringEngine";

async function runVerification() {
  const engine = new AiMonitoringEngine();
  const eventBus = DomainEventBus.getInstance();

  console.log("=== SPRINT 12 VERIFICATION ===");

  // Mock persistence layer (Analytics storage)
  eventBus.subscribe(DomainEventType.AI_SESSION_ENDED, async (event: DomainEvent) => {
    console.log(`[STORAGE] Received ${event.eventType} event. Simulating persistence...`);
    if (event.payload.simulateSlowStorage) {
      console.log(`[STORAGE] Storage is very slow... (Simulated 5s delay)`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      console.log(`[STORAGE] Finally stored event for session ${event.payload.sessionId}`);
    } else if (event.payload.simulateStorageFailure) {
      console.log(`[STORAGE] CRITICAL FAILURE storing event!`);
      throw new Error("Database disconnected!");
    } else {
      console.log(`[STORAGE] Stored event successfully:`, event.payload);
    }
  });

  const tenantId = "restaurant_123";
  const sessionId = "session_xyz";

  // Scenario 1: Missing transcript
  console.log("\nScenario 1: Missing transcript (Session should end successfully)");
  engine.logSessionEnded(tenantId, sessionId, "voice", {
    transcriptLength: 0,
    hasTranscript: false,
    finalIntent: "EXPLORING"
  });
  console.log("Caller continued instantly because events are fire-and-forget.");

  // Scenario 2: Slow analytics storage
  console.log("\nScenario 2: Slow analytics storage (Should not block caller)");
  engine.logSessionEnded(tenantId, "session_slow", "voice", {
    transcriptLength: 1500,
    hasTranscript: true,
    finalIntent: "DECIDED",
    // @ts-ignore
    simulateSlowStorage: true
  });
  console.log("Caller continued instantly, storage is happening in background.");

  // Scenario 3: Failed analytics persistence
  console.log("\nScenario 3: Failed analytics persistence (Should not crash the application)");
  engine.logSessionEnded(tenantId, "session_fail", "voice", {
    transcriptLength: 500,
    hasTranscript: true,
    finalIntent: "RUSHED",
    // @ts-ignore
    simulateStorageFailure: true
  });
  console.log("Caller continued instantly. The Event Bus will trap the error.");

  // Wait a moment for background events to process and print their output
  await new Promise(resolve => setTimeout(resolve, 1000));
}

runVerification().catch(console.error);
