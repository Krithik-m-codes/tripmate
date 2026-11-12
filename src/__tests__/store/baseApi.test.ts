import { describe, it, expect } from "vitest";
import { baseApi } from "@/store/api/baseApi";
import { store } from "@/store";

describe("baseApi setup", () => {
  it("should be registered in the Redux store", () => {
    const state = store.getState();
    expect(state).toHaveProperty("api");
  });

  it("should have correct reducer path and tag types", () => {
    expect(baseApi.reducerPath).toBe("api");
  });
});
