import { NextResponse } from "next/server";
import { retrieveCombinedKnowledge } from "@/lib/ai/knowledge-base";
import { getAuthSession, getSessionUserId } from "@/lib/authSession";

/**
 * GET /api/brain/retrieve
 * Tests and previews the combined RAG retrieval (personal Travel Brain + global chunks)
 * for a specific travel context.
 */
export async function GET(request: Request) {
  try {
    const session = await getAuthSession();
    const sessionUserId = getSessionUserId(session);

    const { searchParams } = new URL(request.url);
    const destination = searchParams.get("destination") || "Global";
    const season = searchParams.get("season") || "any";
    const budget = searchParams.get("budget") || "medium";
    const preferences = searchParams.get("preferences") || "";
    const travelStyle = searchParams.get("travelStyle") || "balanced";

    const combined = await retrieveCombinedKnowledge(
      sessionUserId,
      destination,
      season,
      budget,
      preferences,
      travelStyle
    );

    return NextResponse.json({ success: true, data: combined });
  } catch (error) {
    console.error("GET /api/brain/retrieve error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to retrieve RAG knowledge" },
      { status: 500 }
    );
  }
}
