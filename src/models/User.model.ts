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
  verifyCodeResendCount?: number;
  verifyCodeResendWindowStart?: Date;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  userCreatedAt?: Date;
  isVerified: boolean;
  loginOtp?: string;
  loginOtpExpires?: Date;
  plan: "free" | "pro";
  planStatus: "active" | "past_due" | "canceled";
  planProvider?: "dodo" | null;
  planStartedAt?: Date | null;
  planRenewsAt?: Date | null;
  authProvider?: "credentials" | "google" | "github" | "email-otp";
  organizations?: mongoose.Types.ObjectId[];
  usage?: {
    periodStart: Date;
    itineraryGenerations: number;
    geocodeRequests: number;
  };
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
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]{2,63}$/, "Please fill a valid email address"],
  },
  password: {
    type: String,
    default: "",
  },
  verifyCode: {
    type: String,
    required: [true, "Verify code is required"],
  },
  verifyCodeExpires: {
    type: Date,
    required: [true, "Verify code expires is required"],
  },
  verifyCodeResendCount: {
    type: Number,
    default: 0,
  },
  verifyCodeResendWindowStart: {
    type: Date,
    default: null,
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  loginOtp: { type: String },
  loginOtpExpires: { type: Date },
  plan: {
    type: String,
    enum: ["free", "pro"],
    default: "free",
  },
  planStatus: {
    type: String,
    enum: ["active", "past_due", "canceled"],
    default: "active",
  },
  planProvider: {
    type: String,
    enum: ["dodo"],
    default: null,
  },
  planStartedAt: {
    type: Date,
    default: null,
  },
  planRenewsAt: {
    type: Date,
    default: null,
  },
  authProvider: {
    type: String,
    enum: ["credentials", "google", "github", "email-otp"],
    default: "credentials",
  },
  organizations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
  ],
  usage: {
    periodStart: {
      type: Date,
      default: () => new Date(),
    },
    itineraryGenerations: {
      type: Number,
      default: 0,
    },
    geocodeRequests: {
      type: Number,
      default: 0,
    },
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
const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

// exporting the model so that it can be used in other files
export default UserModel;
