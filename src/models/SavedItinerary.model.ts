import mongoose, { Schema, Document, Model } from "mongoose";

// Saved Itinerary Interface for Schema and Model type definitions in TypeScript with Mongoose types
export interface IRecentItinerary extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  destination: string;
  days: Object;
  activities: string[];
  budget: string;
  travelStyle: string;
  itinerary: string;
  createdAt?: Date;
}

// Saved Itinerary Schema
const RecentItinerarySchema: Schema<IRecentItinerary> = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  days: {
    type: Object,
    required: true,
  },
  activities: {
    type: [String],
    required: true,
  },
  budget: {
    type: String,
    required: true,
  },
  travelStyle: {
    type: String,
    required: true,
  },
  itinerary: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const RecentItineraryModel: Model<IRecentItinerary> =
  mongoose.models.RecentItinerary ||
  mongoose.model<IRecentItinerary>(
    "RecentItinerary",
    RecentItinerarySchema,
    "userRecentItinerary"
  );

export default RecentItineraryModel;
export { RecentItinerarySchema };
