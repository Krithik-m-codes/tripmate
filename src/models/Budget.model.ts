import mongoose, { Schema, Document, Model } from "mongoose";

export interface IExpense {
  id: string;
  title: string;
  amount: number;
  category: "accommodation" | "food" | "transport" | "activities" | "shopping" | "miscellaneous";
  date?: string;
  notes?: string;
}

export interface IBudget extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  tripName: string;
  destination: string;
  currency: string;
  totalBudget: number;
  expenses: IExpense[];
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpense>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  category: {
    type: String,
    enum: ["accommodation", "food", "transport", "activities", "shopping", "miscellaneous"],
    default: "miscellaneous",
  },
  date: { type: String },
  notes: { type: String },
});

const BudgetSchema = new Schema<IBudget>(
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
      default: "My Trip Budget",
    },
    destination: {
      type: String,
      default: "General Trip",
    },
    currency: {
      type: String,
      default: "USD",
    },
    totalBudget: {
      type: Number,
      required: true,
      default: 2000,
    },
    expenses: {
      type: [ExpenseSchema],
      default: [],
    },
  },
  { timestamps: true }
);

BudgetSchema.index({ userId: 1, updatedAt: -1 });

const BudgetModel: Model<IBudget> =
  mongoose.models.Budget || mongoose.model<IBudget>("Budget", BudgetSchema, "userBudgets");

export default BudgetModel;
