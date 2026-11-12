export interface GenerateOptions {
  model: string;
  prompt: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface GenerateResult {
  text: string;
  provider: string;
  model: string;
  tokensUsed?: number;
}

export interface AIProvider {
  name: string;
  generate(opts: GenerateOptions): Promise<GenerateResult>;
}

export interface TravelContext {
  destination: string;
  days: number;
  startDate: string;
  endDate: string;
  season: string;
  budget: string;
  travelStyle: string;
  preferences: string;
}
