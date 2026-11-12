import { streamChat } from "@/lib/ai/sdk-agent";
import { retrieveCombinedKnowledge, formatCombinedRAGContext } from "@/lib/ai/knowledge-base";
import { getAuthSession, getSessionUserId } from "@/lib/authSession";
type ChatRequest = {
  messages: any[];
  provider?: string;
  model?: string;
  useRAG?: boolean;
  /** Optional trip context for RAG enrichment */
  tripContext?: {
    destination?: string;
    budget?: string;
    travelStyle?: string;
    season?: string;
  };
};

/**
 * POST /api/chat
 *
 * Conversational AI chat endpoint for the trip planner.
 * Supports streaming responses and RAG enrichment.
 * Compatible with the Vercel AI SDK `useChat()` hook.
 */
export async function POST(request: Request) {
  const session = await getAuthSession();
  const sessionUserId = getSessionUserId(session);
  if (!sessionUserId) {
    return Response.json(
      { success: false, message: "User not authorized" },
      { status: 401 }
    );
  }

  let body: ChatRequest;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { success: false, message: "Invalid request body" },
      { status: 400 }
    );
  }

  const {
    messages,
    provider = "gemini",
    model = "gemini-1.5-flash",
    useRAG = true,
    tripContext,
  } = body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return Response.json(
      { success: false, message: "Messages array is required" },
      { status: 400 }
    );
  }

  // Build RAG context from trip context if provided
  let ragContext: string | undefined;
  if (useRAG && tripContext?.destination) {
    const session = await getAuthSession();
    const sessionUserId = getSessionUserId(session);

    const combined = await retrieveCombinedKnowledge(
      sessionUserId,
      tripContext.destination,
      tripContext.season || "",
      tripContext.budget || "",
      "", // preferences come from chat messages
      tripContext.travelStyle || "",
      5,
      3
    );

    const formatted = formatCombinedRAGContext(combined);
    if (formatted.trim()) {
      ragContext = `### Curated & Personal Travel Intelligence:\n${formatted}`;
    }
  }

  try {
    const result = await streamChat(messages, provider, model, ragContext);
    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat streaming error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";

    return Response.json(
      { success: false, message: "Chat failed", error: msg },
      { status: 500 }
    );
  }
}
