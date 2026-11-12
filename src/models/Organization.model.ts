import mongoose, { Schema, Model, Document } from "mongoose";

export interface IOrganizationMember {
  userId: mongoose.Schema.Types.ObjectId;
  role: "owner" | "editor" | "viewer";
  joinedAt: Date;
}

export interface IOrganization extends Document {
  name: string;
  slug: string;
  ownerId: mongoose.Schema.Types.ObjectId;
  members: IOrganizationMember[];
  sharedItineraries: mongoose.Schema.Types.ObjectId[];
  sharedPlaces: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationMemberSchema = new Schema<IOrganizationMember>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["owner", "editor", "viewer"],
      default: "viewer",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const OrganizationSchema: Schema<IOrganization> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Organization name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    members: [OrganizationMemberSchema],
    sharedItineraries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RecentItinerary",
      },
    ],
    sharedPlaces: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SavedPlace",
      },
    ],
  },
  {
    timestamps: true,
  }
);

OrganizationSchema.index({ "members.userId": 1 });
OrganizationSchema.index({ slug: 1 });

const OrganizationModel: Model<IOrganization> =
  mongoose.models.Organization || mongoose.model<IOrganization>("Organization", OrganizationSchema);

export default OrganizationModel;
