import mongoose, { Schema, Document, Model } from "mongoose";

// Saved Places Interface for Schema and Model type definitions in TypeScript with Mongoose types
export interface ISavedPlace extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  name: string;
  location: string;
  description: string;
  createdAt?: Date;
}

// Saved Places Schema
const SavedPlacesSchema: Schema<ISavedPlace> = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SavedPlacesModel: Model<ISavedPlace> =
  mongoose.models.SavedPlaces ||
  mongoose.model<ISavedPlace>(
    "SavedPlaces",
    SavedPlacesSchema,
    "userSavedPlaces"
  );

export default SavedPlacesModel;
export { SavedPlacesSchema };
