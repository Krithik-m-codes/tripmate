import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SavedItinerary {
  _id?: string;
  destination: string;
  days: { from: string; to: string };
  activities: string[];
  budget: string;
  travelStyle: string;
  itinerary: string;
  createdAt?: string;
}

interface ItineraryState {
  items: SavedItinerary[];
  loading: boolean;
  error: string | null;
}

const initialState: ItineraryState = {
  items: [],
  loading: false,
  error: null,
};

const itinerarySlice = createSlice({
  name: "itinerary",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setItineraries(state, action: PayloadAction<SavedItinerary[]>) {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    addItinerary(state, action: PayloadAction<SavedItinerary>) {
      state.items.unshift(action.payload);
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const { setLoading, setItineraries, addItinerary, setError, clearError } =
  itinerarySlice.actions;

export default itinerarySlice.reducer;
