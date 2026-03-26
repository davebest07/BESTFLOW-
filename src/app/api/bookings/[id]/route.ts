import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { updateBookingStatus } from "@/lib/firestore";
import {
  doc,
  getDoc,
  db,
} from "@/lib/firebase";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// PATCH /api/bookings/[id] – update booking status (auth required, host only)
export async function PATCH(req: NextRequest, context: RouteContext) {
  const { user, error } = await getAuthUser();
  if (error) return error;

  const { id } = await context.params;

  try {
    // Verify the booking exists and belongs to the host
    const bookingSnap = await getDoc(doc(db, "bookings", id));
    if (!bookingSnap.exists()) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const booking = bookingSnap.data();
    if (booking.hostId !== user!.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { status } = body;

    if (!status || !["confirmed", "cancelled", "pending"].includes(status)) {
      return NextResponse.json(
        { error: "Valid status is required (confirmed | cancelled | pending)" },
        { status: 400 }
      );
    }

    await updateBookingStatus(id, status);
    return NextResponse.json({ id, status });
  } catch (err) {
    console.error("PATCH /api/bookings/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}
