import mongoose, { Schema, Document, Model } from "mongoose";

export interface IItineraryPresence extends Document {
  itineraryId: mongoose.Schema.Types.ObjectId;
  userId: string;
  userName: string;
  userAvatar?: string;
  color: string;
  status: "viewing" | "editing";
  activeDayIdx: number;
  lastHeartbeat: Date;
}

const ItineraryPresenceSchema: Schema<IItineraryPresence> = new Schema(
  {
    itineraryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RecentItinerary",
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    userAvatar: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      default: "#10B981",
    },
    status: {
      type: String,
      enum: ["viewing", "editing"],
      default: "viewing",
    },
    activeDayIdx: {
      type: Number,
      default: 0,
    },
    lastHeartbeat: {
      type: Date,
      default: Date.now,
      index: { expires: 120 }, // Automatically expire and remove stale records after 2 minutes
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to quickly find active collaborators for a given trip
ItineraryPresenceSchema.index({ itineraryId: 1, lastHeartbeat: -1 });
ItineraryPresenceSchema.index({ itineraryId: 1, userId: 1 }, { unique: true });

const ItineraryPresence: Model<IItineraryPresence> =
  mongoose.models.ItineraryPresence ||
  mongoose.model<IItineraryPresence>("ItineraryPresence", ItineraryPresenceSchema);

export default ItineraryPresence;
