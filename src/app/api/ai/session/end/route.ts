import { NextRequest, NextResponse } from "next/server";
import { withApiHandler } from "@/lib/api-framework/auth-wrapper";
import { RequestContextManager } from "@/lib/request-context/RequestContextManager";
import { AiMonitoringEngine } from "@/services/ai/analytics/AiMonitoringEngine";
import { CacheManager } from "@/lib/cache/CacheManager";

const monitoringEngine = new AiMonitoringEngine();

export const POST = withApiHandler(async (req: NextRequest) => {
  const context = RequestContextManager.get();
  
  const body = await req.json();
  const { sessionId, transcript, finalIntent, language, escalatedToHuman } = body;

  if (!sessionId) {
    return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
  }

  // Idempotency Check: Prevent duplicate end-session analytics for the same session.
  const idempotencyKey = `ai:idempotency:session_end:${sessionId}`;
  const alreadyProcessed = await CacheManager.get(idempotencyKey);
  if (alreadyProcessed) {
    return NextResponse.json({ status: "ALREADY_PROCESSED" }, { status: 200 });
  }

  // Mark as processed (TTL 24 hours to prevent long-term replay)
  await CacheManager.set(idempotencyKey, true, 86400);

  // Note: Transcript collection enriches analytics but does not block success.
  const hasTranscript = !!transcript && transcript.length > 0;
  
  // Future: Persist the raw transcript somewhere securely, e.g., Azure Blob Storage or S3
  
  monitoringEngine.logSessionEnded(
    context.tenantId!,
    sessionId,
    "voice", // Assuming voice channel for now, can be extracted from session state if persisted
    {
      transcriptLength: hasTranscript ? transcript.length : 0,
      hasTranscript,
      finalIntent: finalIntent || "UNKNOWN",
      conversationOutcome: escalatedToHuman ? "ESCALATED" : "COMPLETED",
      language: language || "en",
      escalatedToHuman: !!escalatedToHuman
    }
  );

  return NextResponse.json({ status: "SESSION_ENDED_SUCCESSFULLY" });
});
