import type { IUser } from "@/models/User.model";
import { getMonthlyPeriodStart } from "@/lib/plan";

export const ensureMonthlyUsageWindow = (user: IUser) => {
  const now = new Date();
  const currentStart = getMonthlyPeriodStart(now);
  const existingStart = user.usage?.periodStart;

  if (!existingStart || existingStart < currentStart) {
    user.usage = {
      periodStart: currentStart,
      itineraryGenerations: 0,
      geocodeRequests: 0,
    };
    return true;
  }

  return false;
};
