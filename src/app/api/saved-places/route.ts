import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import SavedPlacesModel from "@/models/SavedPlace.model";
import UserModel from "@/models/User.model";
import { getAuthSession, getSessionUserId } from "@/lib/authSession";

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
    const limit = Math.max(1, Math.min(50, parseInt(searchParams.get("limit") || "12", 10)));
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const organizationId = searchParams.get("organizationId") || "";

    const filter: Record<string, unknown> = {};

    if (organizationId) {
      filter.organizationId = organizationId;
    } else {
      filter.userId = sessionUserId;
    }

    if (search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { location: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
      ];
    }

    if (category && category !== "all") {
      filter.category = category;
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      SavedPlacesModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      SavedPlacesModel.countDocuments(filter),
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
    console.error("GET /api/saved-places error:", error);
    return NextResponse.json(
      { success: false, message: "Error retrieving saved places" },
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
      name,
      location,
      description,
      category = "general",
      rating,
      notes = "",
      coordinates,
      organizationId,
    } = body;

    if (!name || !location) {
      return NextResponse.json(
        { success: false, message: "Name and location are required" },
        { status: 400 }
      );
    }

    const user = await UserModel.findById(sessionUserId).exec();
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const newPlace = await SavedPlacesModel.create({
      userId: sessionUserId,
      organizationId: organizationId || undefined,
      name: name.trim(),
      location: location.trim(),
      description: description?.trim() || location.trim(),
      category,
      rating: typeof rating === "number" ? rating : undefined,
      notes,
      coordinates: coordinates || { lat: 0, lng: 0 },
    });

    user.savedPlaces.push(newPlace._id as any);
    await user.save();

    return NextResponse.json(
      { success: true, message: "Saved place added successfully", data: newPlace },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/saved-places error:", error);
    const status = error?.name === "ValidationError" ? 400 : 500;
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to add saved place" },
      { status }
    );
  }
}
