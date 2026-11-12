import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { getLanguageModel } from "@/lib/ai/sdk-providers";
import { StructuredItinerarySchema } from "@/schemas/itinerarySchema";

export const maxDuration = 60; // Allow up to 60s for parallel model comparisons

export async function POST(req: Request) {
  try {
    const { destination, days = 3, budget = "Moderate", travelStyle = "Culture & Foodie", prompt = "" } = await req.json();

    if (!destination) {
      return NextResponse.json({ success: false, message: "Destination is required" }, { status: 400 });
    }

    const systemPrompt = `You are an elite, world-class AI travel planner and destination strategist.
Create a highly personalized, structured ${days}-day itinerary for ${destination} fitting a ${budget} budget and ${travelStyle} travel style.
Additional notes/prompt from user: ${prompt || "Curate authentic spots, logical geographic flow, and hidden gems."}

Be precise, inspiring, and return exact JSON adhering to the schema. Include a concise summary and 3 categorized time-of-day activities plus at least one hidden gem per day.`;

    // Define models to compare
    const modelsToCompare = [
      {
        id: "gemini-flash",
        name: "Google Gemini 1.5 Flash",
        provider: "gemini",
        modelId: "gemini-1.5-flash",
        badge: "Fastest & Balanced",
        costPer1kTokens: 0.00015,
        color: "emerald",
      },
      {
        id: "nvidia-llama",
        name: "NVIDIA NIM Llama 3.1 70B",
        provider: "nvidia-nim",
        modelId: "nvidia/llama-3.1-nemotron-70b-instruct",
        badge: "Open Source Giant",
        costPer1kTokens: 0.0004,
        color: "indigo",
      },
      {
        id: "openrouter-gpt4",
        name: "OpenRouter GPT-4o Mini",
        provider: "openrouter",
        modelId: "openai/gpt-4o-mini",
        badge: "High Precision",
        costPer1kTokens: 0.0003,
        color: "amber",
      },
    ];

    const startTime = Date.now();

    // Run parallel evaluations with Promise.allSettled so if one API key fails or times out, others still return
    const results = await Promise.allSettled(
      modelsToCompare.map(async (modelConfig) => {
        const modelStart = Date.now();
        const model = getLanguageModel(modelConfig.provider, modelConfig.modelId);

        const { object, usage } = await generateObject({
          model,
          schema: StructuredItinerarySchema,
          system: systemPrompt,
          prompt: `Generate the ${days}-day itinerary for ${destination}.`,
          temperature: 0.7,
        });

        const durationMs = Date.now() - modelStart;
        const totalTokens = usage?.totalTokens || (durationMs * 0.4); // Estimate if usage missing
        const estimatedCost = Number(((totalTokens / 1000) * modelConfig.costPer1kTokens).toFixed(5));

        return {
          ...modelConfig,
          durationMs,
          totalTokens: Math.round(totalTokens),
          estimatedCost,
          itinerary: object,
          status: "success",
        };
      })
    );

    const formattedResults = results.map((result, idx) => {
      if (result.status === "fulfilled") {
        return result.value;
      } else {
        // Fallback for failed models (e.g. missing API keys or rate limit)
        return {
          ...modelsToCompare[idx],
          durationMs: Date.now() - startTime,
          totalTokens: 0,
          estimatedCost: 0,
          status: "error",
          error: result.reason?.message || "Model API rate limited or key unavailable",
        };
      }
    });

    return NextResponse.json({
      success: true,
      data: formattedResults,
      totalDurationMs: Date.now() - startTime,
    });
  } catch (error: any) {
    console.error("Model comparison error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to compare AI models" },
      { status: 500 }
    );
  }
}
