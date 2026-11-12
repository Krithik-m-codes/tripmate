import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPackingItem {
  id: string;
  text: string;
  category: "Essentials" | "Clothing" | "Toiletries" | "Electronics" | "Documents" | "Custom";
  checked: boolean;
}

export interface IPackingChecklist extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  tripName: string;
  destination: string;
  items: IPackingItem[];
  createdAt: Date;
  updatedAt: Date;
}

const PackingItemSchema = new Schema<IPackingItem>({
  id: { type: String, required: true },
  text: { type: String, required: true },
  category: {
    type: String,
    enum: ["Essentials", "Clothing", "Toiletries", "Electronics", "Documents", "Custom"],
    default: "Custom",
  },
  checked: { type: Boolean, default: false },
});

const PackingChecklistSchema = new Schema<IPackingChecklist>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tripName: {
      type: String,
      required: true,
      default: "My Packing List",
    },
    destination: {
      type: String,
      default: "General Trip",
    },
    items: {
      type: [PackingItemSchema],
      default: [],
    },
  },
  { timestamps: true }
);

PackingChecklistSchema.index({ userId: 1, updatedAt: -1 });

const PackingChecklistModel: Model<IPackingChecklist> =
  mongoose.models.PackingChecklist ||
  mongoose.model<IPackingChecklist>("PackingChecklist", PackingChecklistSchema, "packingChecklists");

export default PackingChecklistModel;
