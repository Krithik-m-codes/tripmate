export type UserPlan = "free" | "pro";

export type PlanLimits = {
  itineraryGenerationsPerMonth: number | null;
  savedPlaces: number | null;
  savedItineraries: number | null;
  searchHistory: number | null;
  geocodeRequestsPerMonth: number | null;
  mapProvider: "open" | "mapbox";
};

export const PLAN_LIMITS: Record<UserPlan, PlanLimits> = {
  free: {
    itineraryGenerationsPerMonth: 10,
    savedPlaces: 25,
    savedItineraries: 10,
    searchHistory: 50,
    geocodeRequestsPerMonth: 250,
    mapProvider: "open",
  },
  pro: {
    itineraryGenerationsPerMonth: null,
    savedPlaces: null,
    savedItineraries: null,
    searchHistory: null,
    geocodeRequestsPerMonth: null,
    mapProvider: "mapbox",
  },
};

export const getPlanLimits = (plan?: UserPlan | null) => PLAN_LIMITS[plan ?? "free"];

export const isLimitExceeded = (current: number, limit: number | null) =>
  typeof limit === "number" && current >= limit;

export const getMonthlyPeriodStart = (now = new Date()) =>
  new Date(now.getFullYear(), now.getMonth(), 1);
