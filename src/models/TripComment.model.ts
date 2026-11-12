import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITripComment extends Document {
  itineraryId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  userName: string;
  userAvatar?: string;
  targetType: "itinerary" | "day" | "activity";
  targetId: string; // e.g., "general", "day-1", "day-1-act-0"
  content: string;
  isResolved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TripCommentSchema: Schema<ITripComment> = new Schema(
  {
    itineraryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RecentItinerary",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
    targetType: {
      type: String,
      enum: ["itinerary", "day", "activity"],
      default: "itinerary",
      required: true,
    },
    targetId: {
      type: String,
      default: "general",
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    isResolved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast querying by itinerary and target
TripCommentSchema.index({ itineraryId: 1, targetId: 1, createdAt: 1 });

const TripComment: Model<ITripComment> =
  mongoose.models.TripComment ||
  mongoose.model<ITripComment>("TripComment", TripCommentSchema);

export default TripComment;
