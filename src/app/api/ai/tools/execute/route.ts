import { NextRequest, NextResponse } from "next/server";
import { withApiHandler } from "@/lib/api-framework/auth-wrapper";
import { RequestContextManager } from "@/lib/request-context/RequestContextManager";
import { ToolCallingEngine } from "@/services/ai/tools/ToolCallingEngine";

const toolEngine = new ToolCallingEngine();

export const POST = withApiHandler(async (req: NextRequest) => {
  const context = RequestContextManager.get();
  
  const body = await req.json();
  const { sessionId, actionName, args } = body;

  if (!sessionId || !actionName) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // The tool engine handles the safety and business rule execution.
  // We use the tenantId and customerId from the API framework context.
  const result = await toolEngine.executeTool(
    context.tenantId!,
    sessionId,
    context.userId,
    actionName,
    args || {}
  );

  return NextResponse.json({ result });
});
