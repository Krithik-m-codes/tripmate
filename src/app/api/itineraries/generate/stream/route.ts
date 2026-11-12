import { streamItinerary } from "@/lib/ai/sdk-agent";
import type { TravelContext } from "@/lib/ai/types";
import { getAuthSession, getSessionUserId } from "@/lib/authSession";
import UserModel from "@/models/User.model";
import { getPlanLimits, isLimitExceeded } from "@/lib/plan";
import { ensureMonthlyUsageWindow } from "@/lib/planUsage";

type StreamRequest = {
  destination: string;
  duration: { from: string; to: string };
  preferences: string;
  budget: string;
  travelStyle: string;
  provider?: string;
  model?: string;
  useRAG?: boolean;
};

const getSeason = (dateStr: string) => {
  const month = new Date(dateStr).getMonth() + 1;
  if (month >= 6 && month <= 9) return "monsoon season";
  if (month >= 10 && month <= 11) return "post-monsoon / early winter";
  if (month >= 12 || month <= 2) return "winter season";
  return "summer season";
};

/**
 * POST /api/itineraries/generate/stream
 *
 * Streams itinerary tokens to the client as Server-Sent Events.
 * The client can render tokens word-by-word for a much better UX
 * compared to the old one-shot endpoint.
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

  const user = await UserModel.findById(sessionUserId).exec();
  if (!user) {
    return Response.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );
  }

  ensureMonthlyUsageWindow(user);
  const limits = getPlanLimits(user.plan);
  const currentCount = user.usage?.itineraryGenerations ?? 0;
  if (isLimitExceeded(currentCount, limits.itineraryGenerationsPerMonth)) {
    return Response.json(
      {
        success: false,
        message:
          "You reached your monthly itinerary limit. Upgrade to Pro for more.",
      },
      { status: 402 }
    );
  }

  let body: StreamRequest;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { success: false, message: "Invalid request body" },
      { status: 400 }
    );
  }

  const {
    destination,
    duration,
    preferences,
    budget,
    travelStyle,
    provider = "gemini",
    model = "gemini-1.5-flash",
    useRAG = true,
  } = body;

  if (
    !destination ||
    !duration?.from ||
    !duration?.to ||
    !budget ||
    !travelStyle
  ) {
    return Response.json(
      {
        success: false,
        message:
          "Missing required fields: destination, duration, budget, travelStyle",
      },
      { status: 400 }
    );
  }

  const startDate = new Date(duration.from).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const endDate = new Date(duration.to).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const days =
    Math.ceil(
      (new Date(duration.to).getTime() - new Date(duration.from).getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1;

  const ctx: TravelContext = {
    destination,
    days,
    startDate,
    endDate,
    season: getSeason(duration.from),
    budget,
    travelStyle,
    preferences: preferences || "",
  };

  try {
    const result = await streamItinerary(ctx, provider, model, useRAG, sessionUserId);

    // Increment usage counter
    user.usage = user.usage ?? {
      periodStart: new Date(),
      itineraryGenerations: 0,
      geocodeRequests: 0,
    };
    user.usage.itineraryGenerations =
      (user.usage.itineraryGenerations ?? 0) + 1;
    await user.save();

    // Return the streaming response directly
    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Streaming itinerary error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";

    if (msg.includes("not configured")) {
      return Response.json(
        { success: false, message: `AI provider not configured: ${msg}` },
        { status: 503 }
      );
    }

    return Response.json(
      { success: false, message: "Failed to generate itinerary", error: msg },
      { status: 500 }
    );
  }
}
