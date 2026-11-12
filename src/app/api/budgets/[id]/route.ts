import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import BudgetModel from "@/models/Budget.model";
import { getAuthSession, getSessionUserId } from "@/lib/authSession";

/**
 * DELETE /api/budgets/[id]
 * Deletes a budget owned by the authenticated user.
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  try {
    const session = await getAuthSession();
    const sessionUserId = getSessionUserId(session);
    if (!sessionUserId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await BudgetModel.findOneAndDelete({ _id: id, userId: sessionUserId });
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Budget not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Budget deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/budgets/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to delete budget" }, { status: 500 });
  }
}
