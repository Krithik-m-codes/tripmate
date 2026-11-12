import "server-only";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AIProvider, GenerateOptions, GenerateResult } from "./types";

// ─── Gemini ───────────────────────────────────────────────────────────────────
export class GeminiProvider implements AIProvider {
  name = "gemini";
  private client: GoogleGenerativeAI;

  constructor() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error("GEMINI_API_KEY not configured");
    this.client = new GoogleGenerativeAI(key);
  }

  async generate(opts: GenerateOptions): Promise<GenerateResult> {
    const model = this.client.getGenerativeModel({
      model: opts.model || "gemini-1.5-flash",
      systemInstruction: opts.systemPrompt,
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: opts.prompt }] }],
      generationConfig: {
        maxOutputTokens: opts.maxTokens ?? 8192,
        temperature: opts.temperature ?? 0.7,
      },
    });

    return {
      text: result.response.text(),
      provider: "gemini",
      model: opts.model,
    };
  }
}

// ─── NVIDIA NIM ───────────────────────────────────────────────────────────────
export class NvidiaProvider implements AIProvider {
  name = "nvidia-nim";
  private baseURL = "https://integrate.api.nvidia.com/v1";
  private apiKey: string;

  constructor() {
    const key = process.env.NVIDIA_API_KEY;
    if (!key) throw new Error("NVIDIA_API_KEY not configured");
    this.apiKey = key;
  }

  async generate(opts: GenerateOptions): Promise<GenerateResult> {
    const messages = [];
    if (opts.systemPrompt) {
      messages.push({ role: "system", content: opts.systemPrompt });
    }
    messages.push({ role: "user", content: opts.prompt });

    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: opts.model || "nvidia/llama-3.1-nemotron-70b-instruct",
        messages,
        max_tokens: opts.maxTokens ?? 4096,
        temperature: opts.temperature ?? 0.7,
        stream: false,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`NVIDIA NIM error ${response.status}: ${err}`);
    }

    const data = await response.json();
    return {
      text: data.choices[0].message.content,
      provider: "nvidia-nim",
      model: opts.model,
      tokensUsed: data.usage?.total_tokens,
    };
  }
}

// ─── OpenRouter ───────────────────────────────────────────────────────────────
export class OpenRouterProvider implements AIProvider {
  name = "openrouter";
  private baseURL = "https://openrouter.ai/api/v1";
  private apiKey: string;

  constructor() {
    const key = process.env.OPENROUTER_API_KEY;
    if (!key) throw new Error("OPENROUTER_API_KEY not configured");
    this.apiKey = key;
  }

  async generate(opts: GenerateOptions): Promise<GenerateResult> {
    const messages = [];
    if (opts.systemPrompt) {
      messages.push({ role: "system", content: opts.systemPrompt });
    }
    messages.push({ role: "user", content: opts.prompt });

    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://tripmate.vercel.app",
        "X-Title": "TripMate",
      },
      body: JSON.stringify({
        model: opts.model,
        messages,
        max_tokens: opts.maxTokens ?? 4096,
        temperature: opts.temperature ?? 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`OpenRouter error ${response.status}: ${err}`);
    }

    const data = await response.json();
    return {
      text: data.choices[0].message.content,
      provider: "openrouter",
      model: opts.model,
      tokensUsed: data.usage?.total_tokens,
    };
  }
}

// ─── Factory ──────────────────────────────────────────────────────────────────
export function getProvider(provider: string): AIProvider {
  switch (provider) {
    case "nvidia-nim":
      return new NvidiaProvider();
    case "openrouter":
      return new OpenRouterProvider();
    case "gemini":
    default:
      return new GeminiProvider();
  }
}
