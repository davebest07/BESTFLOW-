import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { setAvailability, getAvailability } from "@/lib/firestore";
import type { Availability } from "@/lib/types";

// GET /api/availability?userId=xxx
// Public (for booking page) if userId is provided,
// otherwise returns the authenticated user's availability.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  // Public access for booking pages
  if (userId) {
    try {
      const slots = await getAvailability(userId);
      return NextResponse.json(slots);
    } catch (err) {
      console.error("GET /api/availability error:", err);
      return NextResponse.json(
        { error: "Failed to fetch availability" },
        { status: 500 }
      );
    }
  }

  // Authenticated access for own availability
  const { user, error } = await getAuthUser();
  if (error) return error;

  try {
    const slots = await getAvailability(user!.id);
    return NextResponse.json(slots);
  } catch (err) {
    console.error("GET /api/availability error:", err);
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    );
  }
}

// PUT /api/availability – replace all availability slots for authenticated user
export async function PUT(req: NextRequest) {
  const { user, error } = await getAuthUser();
  if (error) return error;

  try {
    const body = await req.json();
    const { slots } = body as { slots: Availability[] };

    if (!Array.isArray(slots)) {
      return NextResponse.json(
        { error: "slots array is required" },
        { status: 400 }
      );
    }

    // Ensure all slots belong to the authenticated user
    const sanitized = slots.map((slot) => ({
      userId: user!.id,
      dayOfWeek: slot.dayOfWeek,
      startTime: slot.startTime,
      endTime: slot.endTime,
      isActive: slot.isActive,
    }));

    await setAvailability(sanitized);
    return NextResponse.json({ success: true, count: sanitized.length });
  } catch (err) {
    console.error("PUT /api/availability error:", err);
    return NextResponse.json(
      { error: "Failed to save availability" },
      { status: 500 }
    );
  }
}
