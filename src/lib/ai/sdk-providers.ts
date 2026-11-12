import "server-only";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

// ─── Provider factories ──────────────────────────────────────────────────────
// These return Vercel AI SDK-compatible model instances that work with
// `generateText()`, `streamText()`, and `generateObject()`.

function geminiModel(modelId: string): LanguageModel {
  const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  return google(modelId || "gemini-1.5-flash");
}

function nvidiaModel(modelId: string): LanguageModel {
  // NVIDIA NIM exposes an OpenAI-compatible API
  const nvidia = createOpenAI({
    apiKey: process.env.NVIDIA_API_KEY,
    baseURL: "https://integrate.api.nvidia.com/v1",
  });
  return nvidia(modelId || "nvidia/llama-3.1-nemotron-70b-instruct");
}

function openrouterModel(modelId: string): LanguageModel {
  // OpenRouter also exposes an OpenAI-compatible API
  const openrouter = createOpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
    headers: {
      "HTTP-Referer": "https://tripmate.vercel.app",
      "X-Title": "TripMate",
    },
  });
  return openrouter(modelId);
}

// ─── Unified model resolver ──────────────────────────────────────────────────
/**
 * Returns a Vercel AI SDK LanguageModel for the given provider and model ID.
 * Works with `generateText()`, `streamText()`, and `generateObject()`.
 */
export function getLanguageModel(
  provider: string,
  modelId: string
): LanguageModel {
  switch (provider) {
    case "nvidia-nim":
      return nvidiaModel(modelId);
    case "openrouter":
      return openrouterModel(modelId);
    case "gemini":
    default:
      return geminiModel(modelId);
  }
}
