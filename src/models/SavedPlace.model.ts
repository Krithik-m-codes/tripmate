import mongoose, { Schema, Document, Model } from "mongoose";

// Saved Places Interface for Schema and Model type definitions in TypeScript with Mongoose types
export interface ISavedPlace extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  organizationId?: mongoose.Schema.Types.ObjectId;
  name: string;
  location: string;
  description: string;
  category?: "restaurant" | "attraction" | "hotel" | "hidden_gem" | "general";
  rating?: number;
  notes?: string;
  coordinates?: { lat: number; lng: number };
  createdAt?: Date;
}

// Saved Places Schema
const SavedPlacesSchema: Schema<ISavedPlace> = new Schema({
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
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["restaurant", "attraction", "hotel", "hidden_gem", "general"],
    default: "general",
    index: true,
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
  coordinates: {
    lat: { type: Number },
    lng: { type: Number },
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

SavedPlacesSchema.index({ userId: 1, createdAt: -1 });

const SavedPlacesModel: Model<ISavedPlace> =
  mongoose.models.SavedPlaces ||
  mongoose.model<ISavedPlace>(
    "SavedPlaces",
    SavedPlacesSchema,
    "userSavedPlaces"
  );

export default SavedPlacesModel;
export { SavedPlacesSchema };
