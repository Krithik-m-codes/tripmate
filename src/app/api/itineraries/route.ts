import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import RecentItineraryModel from "@/models/SavedItinerary.model";
import UserModel from "@/models/User.model";
import { getAuthSession, getSessionUserId } from "@/lib/authSession";
import { getPlanLimits, isLimitExceeded } from "@/lib/plan";

export async function GET(request: Request) {
  await dbConnect();
  try {
    const session = await getAuthSession();
    const sessionUserId = getSessionUserId(session);
    if (!sessionUserId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(50, parseInt(searchParams.get("limit") || "10", 10)));
    const search = searchParams.get("search") || "";
    const budget = searchParams.get("budget") || "";
    const travelStyle = searchParams.get("travelStyle") || "";
    const organizationId = searchParams.get("organizationId") || "";

    const filter: Record<string, unknown> = {};

    if (organizationId) {
      filter.organizationId = organizationId;
    } else {
      filter.userId = sessionUserId;
    }

    if (search.trim()) {
      filter.$or = [
        { destination: { $regex: search.trim(), $options: "i" } },
        { activities: { $regex: search.trim(), $options: "i" } },
        { tags: { $regex: search.trim(), $options: "i" } },
      ];
    }

    if (budget) filter.budget = budget;
    if (travelStyle) filter.travelStyle = travelStyle;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      RecentItineraryModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      RecentItineraryModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
      },
    });
  } catch (error) {
    console.error("GET /api/itinerary error:", error);
    return NextResponse.json(
      { success: false, message: "Error retrieving itineraries" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const session = await getAuthSession();
    const sessionUserId = getSessionUserId(session);
    if (!sessionUserId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      itinerary,
      destination,
      days,
      activities,
      budget,
      travelStyle,
      organizationId,
      isPublic,
      tags,
      rating,
      notes,
    } = body;

    const trimmedDestination = typeof destination === "string" ? destination.trim() : "";
    if (!trimmedDestination || !days?.from || !days?.to || !budget || !travelStyle) {
      return NextResponse.json(
        { success: false, message: "Destination, dates, budget, and travel style are required" },
        { status: 400 }
      );
    }

    const user = await UserModel.findById(sessionUserId).exec();
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const limits = getPlanLimits(user.plan);
    const itineraryCount = await RecentItineraryModel.countDocuments({ userId: sessionUserId });
    if (isLimitExceeded(itineraryCount, limits.savedItineraries)) {
      return NextResponse.json(
        { success: false, message: "Saved itineraries limit reached. Upgrade to Pro for more." },
        { status: 402 }
      );
    }

    const newSavedItinerary = await RecentItineraryModel.create({
      userId: sessionUserId,
      organizationId: organizationId || undefined,
      itinerary,
      destination: trimmedDestination,
      days,
      activities: activities || [],
      budget,
      travelStyle,
      isPublic: Boolean(isPublic),
      tags: Array.isArray(tags) ? tags : [],
      rating: typeof rating === "number" ? rating : undefined,
      notes: typeof notes === "string" ? notes : "",
    });

    user.savedItineraries.push(newSavedItinerary._id as any);
    await user.save();

    return NextResponse.json(
      { success: true, message: "Itinerary saved successfully", data: newSavedItinerary },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/itinerary error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save itinerary" },
      { status: 500 }
    );
  }
}
