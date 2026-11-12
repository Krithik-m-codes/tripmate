import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SavedPlace {
  _id?: string;
  name: string;
  location: string;
  description: string;
}

interface SavedPlacesState {
  items: SavedPlace[];
  loading: boolean;
  error: string | null;
}

const initialState: SavedPlacesState = {
  items: [],
  loading: false,
  error: null,
};

const savedPlacesSlice = createSlice({
  name: "savedPlaces",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setSavedPlaces(state, action: PayloadAction<SavedPlace[]>) {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    addPlace(state, action: PayloadAction<SavedPlace>) {
      state.items.unshift(action.payload);
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setLoading, setSavedPlaces, addPlace, setError } =
  savedPlacesSlice.actions;

export default savedPlacesSlice.reducer;
