import mongoose, { Schema, Document, Model } from "mongoose";
import type { StructuredItinerary } from "@/schemas/itinerarySchema";

// Saved Itinerary Interface for Schema and Model type definitions in TypeScript with Mongoose types
export interface IRecentItinerary extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  organizationId?: mongoose.Schema.Types.ObjectId;
  destination: string;
  days: Record<string, any>;
  activities: string[];
  budget: string;
  travelStyle: string;
  /** Structured JSON itinerary (new) or legacy plain-text string */
  itinerary: StructuredItinerary | string;
  /** Indicates whether `itinerary` is structured JSON or legacy text */
  itineraryFormat: "structured" | "legacy";
  isPublic?: boolean;
  shareToken?: string;
  tags?: string[];
  rating?: number;
  notes?: string;
  createdAt?: Date;
}

// Saved Itinerary Schema
const RecentItinerarySchema: Schema<IRecentItinerary> = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    index: true,
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
    type: Schema.Types.Mixed,
    required: true,
  },
  itineraryFormat: {
    type: String,
    enum: ["structured", "legacy"],
    default: "legacy",
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  shareToken: {
    type: String,
    unique: true,
    sparse: true,
    index: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  notes: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

RecentItinerarySchema.index({ userId: 1, createdAt: -1 });
RecentItinerarySchema.index({ shareToken: 1 });

const RecentItineraryModel: Model<IRecentItinerary> =
  mongoose.models.RecentItinerary ||
  mongoose.model<IRecentItinerary>(
    "RecentItinerary",
    RecentItinerarySchema,
    "userRecentItinerary"
  );

export default RecentItineraryModel;
export { RecentItinerarySchema };
