import mongoose, { Schema, Model, Document } from "mongoose";

// Search History Interface for Schema and Model type definitions in TypeScript with Mongoose types
export interface ISearchHistory extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  search: string;
  createdAt?: Date;
}

// Search History Schema
const SearchHistorySchema: Schema<ISearchHistory> = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  search: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SearchHistoryModel: Model<ISearchHistory> =
  mongoose.models.SearchHistory ||
  mongoose.model<ISearchHistory>(
    "SearchHistory",
    SearchHistorySchema,
    "userRecentSearch"
  );

export default SearchHistoryModel;
export { SearchHistorySchema };
