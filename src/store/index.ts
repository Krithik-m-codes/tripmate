import { configureStore } from "@reduxjs/toolkit";
import aiReducer from "./slices/aiSlice";
import itineraryReducer from "./slices/itinerarySlice";
import savedPlacesReducer from "./slices/savedPlacesSlice";
import { baseApi } from "./api/baseApi";

export const store = configureStore({
  reducer: {
    ai: aiReducer,
    itinerary: itineraryReducer,
    savedPlaces: savedPlacesReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
