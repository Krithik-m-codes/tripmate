import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import BudgetModel from "@/models/Budget.model";
import { getAuthSession, getSessionUserId } from "@/lib/authSession";

/**
 * GET /api/budgets
 * Retrieves all budgets for the authenticated user.
 */
export async function GET() {
  await dbConnect();
  try {
    const session = await getAuthSession();
    const sessionUserId = getSessionUserId(session);
    if (!sessionUserId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const budgets = await BudgetModel.find({ userId: sessionUserId })
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: budgets });
  } catch (error) {
    console.error("GET /api/budgets error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch budgets" }, { status: 500 });
  }
}

/**
 * POST /api/budgets
 * Creates a new budget or updates an existing one if _id is provided.
 */
export async function POST(request: Request) {
  await dbConnect();
  try {
    const session = await getAuthSession();
    const sessionUserId = getSessionUserId(session);
    if (!sessionUserId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { _id, tripName, destination, currency, totalBudget, expenses } = body;

    if (_id) {
      // Update existing budget
      const updated = await BudgetModel.findOneAndUpdate(
        { _id, userId: sessionUserId },
        {
          tripName: tripName?.trim() || "My Trip Budget",
          destination: destination?.trim() || "General Trip",
          currency: currency || "USD",
          totalBudget: typeof totalBudget === "number" ? totalBudget : 2000,
          expenses: Array.isArray(expenses) ? expenses : [],
        },
        { new: true }
      );
      if (!updated) {
        return NextResponse.json({ success: false, message: "Budget not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: updated, message: "Budget saved" });
    } else {
      // Create new budget
      const newBudget = await BudgetModel.create({
        userId: sessionUserId,
        tripName: tripName?.trim() || "My Trip Budget",
        destination: destination?.trim() || "General Trip",
        currency: currency || "USD",
        totalBudget: typeof totalBudget === "number" ? totalBudget : 2000,
        expenses: Array.isArray(expenses) ? expenses : [],
      });
      return NextResponse.json({ success: true, data: newBudget, message: "Budget created" });
    }
  } catch (error: any) {
    console.error("POST /api/budgets error:", error);
    const status = error?.name === "ValidationError" ? 400 : 500;
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to save budget" },
      { status }
    );
  }
}
