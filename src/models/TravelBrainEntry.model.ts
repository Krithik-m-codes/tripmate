import mongoose, { Schema, Document, Model } from "mongoose";

export type BrainCategory =
  | "hidden_gems"
  | "food_etiquette"
  | "packing"
  | "budget"
  | "safety"
  | "local_customs"
  | "flight_hacks"
  | "general";

export interface ITravelBrainEntry extends Document {
  userId: mongoose.Schema.Types.ObjectId | string;
  title: string;
  destination?: string;
  category: BrainCategory;
  content: string;
  tags: string[];
  isShared?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TravelBrainEntrySchema = new Schema<ITravelBrainEntry>(
  {
    userId: { type: Schema.Types.Mixed, required: true, index: true },
    title: { type: String, required: true, trim: true },
    destination: { type: String, default: "", trim: true, index: true },
    category: {
      type: String,
      required: true,
      enum: [
        "hidden_gems",
        "food_etiquette",
        "packing",
        "budget",
        "safety",
        "local_customs",
        "flight_hacks",
        "general",
      ],
      default: "general",
    },
    content: { type: String, required: true },
    tags: [{ type: String, trim: true }],
    isShared: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Index for fast RAG keyword and destination search
TravelBrainEntrySchema.index({ userId: 1, destination: 1, category: 1 });

const TravelBrainEntry: Model<ITravelBrainEntry> =
  mongoose.models.TravelBrainEntry ||
  mongoose.model<ITravelBrainEntry>("TravelBrainEntry", TravelBrainEntrySchema);

export default TravelBrainEntry;
