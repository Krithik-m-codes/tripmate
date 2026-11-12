import { describe, it, expect } from "vitest";
import aiReducer, {
  setSelectedModel,
  setGenerating,
  setGeneratedItinerary,
  clearItinerary,
  toggleRAG,
  AI_MODELS,
} from "@/store/slices/aiSlice";

describe("aiSlice reducer", () => {
  const initialState = {
    selectedModel: AI_MODELS[0],
    isGenerating: false,
    generatedItinerary: "",
    error: null,
    useRAG: true,
    streamingChunks: [],
  };

  it("should return initial state", () => {
    expect(aiReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should handle setSelectedModel", () => {
    const newModel = AI_MODELS[1];
    const state = aiReducer(initialState, setSelectedModel(newModel));
    expect(state.selectedModel).toEqual(newModel);
  });

  it("should handle setGenerating", () => {
    const state = aiReducer(initialState, setGenerating(true));
    expect(state.isGenerating).toBe(true);
  });

  it("should handle setGeneratedItinerary", () => {
    const state = aiReducer(initialState, setGeneratedItinerary("Sample itinerary text"));
    expect(state.generatedItinerary).toEqual("Sample itinerary text");
  });

  it("should handle clearItinerary", () => {
    const modifiedState = { ...initialState, generatedItinerary: "Test", error: "Some error" };
    const state = aiReducer(modifiedState, clearItinerary());
    expect(state.generatedItinerary).toBe("");
    expect(state.error).toBe(null);
  });

  it("should handle toggleRAG", () => {
    const state = aiReducer(initialState, toggleRAG());
    expect(state.useRAG).toBe(false);
  });
});
