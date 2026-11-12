import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AIProvider = "gemini" | "nvidia-nim" | "openrouter";

export type AIModel = {
  id: string;
  label: string;
  provider: AIProvider;
  description: string;
};

export const AI_MODELS: AIModel[] = [
  {
    id: "gemini-1.5-flash",
    label: "Gemini 1.5 Flash",
    provider: "gemini",
    description: "Fast & capable — Google's latest Flash model",
  },
  {
    id: "gemini-1.5-pro",
    label: "Gemini 1.5 Pro",
    provider: "gemini",
    description: "Highest quality — longer context, deeper reasoning",
  },
  {
    id: "nvidia/llama-3.1-nemotron-70b-instruct",
    label: "Nemotron 70B",
    provider: "nvidia-nim",
    description: "NVIDIA NIM — optimised for instruction following",
  },
  {
    id: "nvidia/mistral-nemo-12b-instruct",
    label: "Mistral Nemo 12B",
    provider: "nvidia-nim",
    description: "NVIDIA NIM — lightweight, fast Mistral variant",
  },
  {
    id: "anthropic/claude-3.5-sonnet",
    label: "Claude 3.5 Sonnet",
    provider: "openrouter",
    description: "OpenRouter — Claude via unified API",
  },
  {
    id: "openai/gpt-4o",
    label: "GPT-4o",
    provider: "openrouter",
    description: "OpenRouter — OpenAI GPT-4o",
  },
  {
    id: "meta-llama/llama-3.3-70b-instruct",
    label: "Llama 3.3 70B",
    provider: "openrouter",
    description: "OpenRouter — Meta Llama 3.3, open-weight",
  },
];

interface AIState {
  selectedModel: AIModel;
  isGenerating: boolean;
  generatedItinerary: string;
  error: string | null;
  useRAG: boolean;
  streamingChunks: string[];
}

const initialState: AIState = {
  selectedModel: AI_MODELS[0],
  isGenerating: false,
  generatedItinerary: "",
  error: null,
  useRAG: true,
  streamingChunks: [],
};

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    setSelectedModel(state, action: PayloadAction<AIModel>) {
      state.selectedModel = action.payload;
    },
    setGenerating(state, action: PayloadAction<boolean>) {
      state.isGenerating = action.payload;
    },
    setGeneratedItinerary(state, action: PayloadAction<string>) {
      state.generatedItinerary = action.payload;
    },
    appendItineraryChunk(state, action: PayloadAction<string>) {
      state.generatedItinerary += action.payload;
      state.streamingChunks.push(action.payload);
    },
    clearItinerary(state) {
      state.generatedItinerary = "";
      state.streamingChunks = [];
      state.error = null;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    toggleRAG(state) {
      state.useRAG = !state.useRAG;
    },
  },
});

export const {
  setSelectedModel,
  setGenerating,
  setGeneratedItinerary,
  appendItineraryChunk,
  clearItinerary,
  setError,
  toggleRAG,
} = aiSlice.actions;

export default aiSlice.reducer;
