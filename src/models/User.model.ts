import mongoose, { Schema, Model, Document } from "mongoose";
import { ISearchHistory } from "./SearchHistory.model";
import { ISavedPlace } from "./SavedPlace.model";
import { IRecentItinerary } from "./SavedItinerary.model";

// User Interface for Schema and Model type definitions in TypeScript with Mongoose types
export interface IUser extends Document {
  username: string;
  avatar: string;
  name: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpires: Date;
  userCreatedAt?: Date;
  isVerified: boolean;
  searchHistory: mongoose.Types.DocumentArray<ISearchHistory>;
  savedPlaces: mongoose.Types.DocumentArray<ISavedPlace>;
  savedItineraries: mongoose.Types.DocumentArray<IRecentItinerary>;
}

// User Schema
const UserSchema: Schema<IUser> = new Schema({
  username: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  userCreatedAt: {
    type: Date,
    default: Date.now,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verifyCode: {
    type: String,
    required: [true, "Verify code is required"],
  },
  verifyCodeExpires: {
    type: Date,
    required: [true, "Verify code expires is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  searchHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SearchHistory",
    },
  ],
  savedPlaces: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SavedPlace",
    },
  ],
  savedItineraries: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SavedItinerary",
    },
  ],
});

// Check if the model is already defined or not
const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

// exporting the model so that it can be used in other files
export default UserModel;
