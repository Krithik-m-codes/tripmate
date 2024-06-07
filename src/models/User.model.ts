import mongoose, { Schema, Document } from "mongoose";

// Saved Places Interface - Saved Places Model will implement this interface to have a strong type checking for Saved Places Model instance
export interface SavedPlaces extends Document {
  name: string;
  location: string;
  description: string;
  image: string;
  createdAt?: Date;
}

// Saved Places Schema
const SavedPlacesSchema: Schema<SavedPlaces> = new Schema({
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
  image: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// User Interface - User Model will implement this interface to have a strong type checking for User Model instance
export interface User extends Document {
  username: string;
  avatar: string;
  name: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpires: Date;
  userCreatedAt: Date;
  isVerified: boolean;
  searchHistory: string[];
  savedPlaces: SavedPlaces[];
}

// User Schema
const UserSchema: Schema<User> = new Schema({
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
  searchHistory: {
    type: [String],
    required: true,
  },
  savedPlaces: [SavedPlacesSchema],
});

//next js check if model is already defined or not if yes then use that model else create new model with name User
const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
