import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import {
  getMeetingEvent,
  updateMeetingEvent,
  deleteMeetingEvent,
} from "@/lib/firestore";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/meetings/[id] – get a single meeting event (public – for booking page)
export async function GET(_req: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {
    const event = await getMeetingEvent(id);
    if (!event) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(event);
  } catch (err) {
    console.error("GET /api/meetings/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch meeting" },
      { status: 500 }
    );
  }
}

// PATCH /api/meetings/[id] – update a meeting event (auth required, owner only)
export async function PATCH(req: NextRequest, context: RouteContext) {
  const { user, error } = await getAuthUser();
  if (error) return error;

  const { id } = await context.params;

  try {
    const event = await getMeetingEvent(id);
    if (!event) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (event.hostId !== user!.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const allowed = [
      "title",
      "description",
      "duration",
      "locationType",
      "locationDetails",
      "themeColor",
    ] as const;
    const updates: Record<string, unknown> = {};
    for (const key of allowed) {
      if (body[key] !== undefined) updates[key] = body[key];
    }

    await updateMeetingEvent(id, updates);
    return NextResponse.json({ id, ...updates });
  } catch (err) {
    console.error("PATCH /api/meetings/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to update meeting" },
      { status: 500 }
    );
  }
}

// DELETE /api/meetings/[id] – delete a meeting event (auth required, owner only)
export async function DELETE(_req: NextRequest, context: RouteContext) {
  const { user, error } = await getAuthUser();
  if (error) return error;

  const { id } = await context.params;

  try {
    const event = await getMeetingEvent(id);
    if (!event) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (event.hostId !== user!.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await deleteMeetingEvent(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/meetings/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to delete meeting" },
      { status: 500 }
    );
  }
}
