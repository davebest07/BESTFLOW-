import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import {
  createBooking,
  getBookingsByHost,
  getBookingsByEvent,
  getBookingsByDate,
  getMeetingEvent,
} from "@/lib/firestore";
import { sendBookingConfirmationEmails } from "@/lib/email";

// GET /api/bookings?eventId=xxx&date=yyyy-mm-dd
// - With eventId + date → public (returns confirmed bookings for that date)
// - With eventId only  → auth required (host must own the event)
// - No params          → auth required (all bookings for the host)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");
  const date = searchParams.get("date");

  // Public: bookings for a specific event + date (used by booking page)
  if (eventId && date) {
    try {
      const bookings = await getBookingsByDate(eventId, date);
      // Only return times (no attendee PII) for public use
      const times = bookings.map((b) => ({ time: b.time, duration: b.duration }));
      return NextResponse.json(times);
    } catch (err) {
      console.error("GET /api/bookings error:", err);
      return NextResponse.json(
        { error: "Failed to fetch bookings" },
        { status: 500 }
      );
    }
  }

  // Auth required from here on
  const { user, error } = await getAuthUser();
  if (error) return error;

  try {
    // Bookings for a specific event (host must own it)
    if (eventId) {
      const event = await getMeetingEvent(eventId);
      if (!event || event.hostId !== user!.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      const bookings = await getBookingsByEvent(eventId);
      return NextResponse.json(bookings);
    }

    // All bookings for the authenticated host
    const bookings = await getBookingsByHost(user!.id);
    return NextResponse.json(bookings);
  } catch (err) {
    console.error("GET /api/bookings error:", err);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

// POST /api/bookings – create a booking (public – attendee books a slot)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventId, attendeeName, attendeeEmail, date, time, note } = body;

    if (!eventId || !attendeeName || !attendeeEmail || !date || !time) {
      return NextResponse.json(
        {
          error:
            "eventId, attendeeName, attendeeEmail, date, and time are required",
        },
        { status: 400 }
      );
    }

    // Validate the event exists
    const event = await getMeetingEvent(eventId);
    if (!event) {
      return NextResponse.json(
        { error: "Meeting event not found" },
        { status: 404 }
      );
    }

    // Check the time slot isn't already booked
    const existing = await getBookingsByDate(eventId, date);
    const alreadyBooked = existing.some((b) => b.time === time);
    if (alreadyBooked) {
      return NextResponse.json(
        { error: "This time slot is already booked" },
        { status: 409 }
      );
    }

    const booking = {
      eventId,
      hostId: event.hostId,
      attendeeName,
      attendeeEmail,
      date,
      time,
      duration: event.duration,
      status: "confirmed" as const,
      note: note || "",
    };

    const id = await createBooking(booking);

    // Fire confirmation emails (non-blocking — don't fail the booking if email fails)
    sendBookingConfirmationEmails({
      attendeeName,
      attendeeEmail,
      hostName: event.hostName,
      hostEmail: event.hostEmail,
      eventTitle: event.title,
      date,
      time,
      duration: event.duration,
      locationType: event.locationType,
    }).catch((err) => console.error("Email send failed:", err));

    return NextResponse.json({ id, ...booking }, { status: 201 });
  } catch (err) {
    console.error("POST /api/bookings error:", err);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
