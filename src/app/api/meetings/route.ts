import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import {
  createMeetingEvent,
  getMeetingEventsByHost,
} from "@/lib/firestore";

// GET /api/meetings – list all events for the authenticated user
export async function GET() {
  const { user, error } = await getAuthUser();
  if (error) return error;

  try {
    const events = await getMeetingEventsByHost(user!.id);
    return NextResponse.json(events);
  } catch (err) {
    console.error("GET /api/meetings error:", err);
    return NextResponse.json(
      { error: "Failed to fetch meetings" },
      { status: 500 }
    );
  }
}

// POST /api/meetings – create a new meeting event
export async function POST(req: NextRequest) {
  const { user, error } = await getAuthUser();
  if (error) return error;

  try {
    const body = await req.json();
    const { title, description, duration, locationType, locationDetails, themeColor } = body;

    if (!title || !duration || !locationType) {
      return NextResponse.json(
        { error: "title, duration, and locationType are required" },
        { status: 400 }
      );
    }

    const event = {
      title,
      description: description || "",
      duration: Number(duration),
      locationType,
      locationDetails: locationDetails || "",
      themeColor: themeColor || "#6366f1",
      hostId: user!.id,
      hostName:
        user!.given_name && user!.family_name
          ? `${user!.given_name} ${user!.family_name}`
          : user!.given_name || "Host",
      hostEmail: user!.email || "",
    };

    const id = await createMeetingEvent(event);
    return NextResponse.json({ id, ...event }, { status: 201 });
  } catch (err) {
    console.error("POST /api/meetings error:", err);
    return NextResponse.json(
      { error: "Failed to create meeting" },
      { status: 500 }
    );
  }
}
