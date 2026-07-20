import { NextResponse } from "next/server";
import { ConversationEngine } from "@/services/ai/core/ConversationEngine";
import { OpenAiRealtimeAdapter } from "@/services/ai/providers/OpenAiRealtimeAdapter";
import { withApiHandler, RouteContext } from "@/lib/api-framework/auth-wrapper";
import { RateLimitPolicies } from "@/lib/rate-limiting/RateLimitPolicies";

const voiceAdapter = new OpenAiRealtimeAdapter();
const conversationEngine = new ConversationEngine(voiceAdapter);

async function aiSessionHandler(req: Request, ctx: RouteContext) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const tenantId = body.tenantId || (ctx.user && ctx.user.restaurantId);
  if (!tenantId) {
    return NextResponse.json({ error: "Tenant context missing" }, { status: 400 });
  }

  try {
    // Initialize session and generate ephemeral token
    const result = await conversationEngine.initializeVoiceSession(tenantId, body.customerId);
    
    // Return the token and session ID to the client
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("AI Session Initialization Error:", error);
    return NextResponse.json({ error: "Failed to initialize AI session" }, { status: 500 });
  }
}

// Ensure the endpoint is context-aware (public for customers)
export const POST = withApiHandler(aiSessionHandler as any, {
  requireAuth: false,
  rateLimit: RateLimitPolicies.AI_GENERATION
});
