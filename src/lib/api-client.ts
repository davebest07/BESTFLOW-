import type { MeetingEvent, Availability, Booking } from "./types";

const BASE = "";

async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

// ── Meeting Events ──────────────────────────────────────────

export async function apiGetMeetings(): Promise<MeetingEvent[]> {
  return fetchJSON("/api/meetings");
}

export async function apiGetMeeting(id: string): Promise<MeetingEvent> {
  return fetchJSON(`/api/meetings/${id}`);
}

export async function apiCreateMeeting(
  data: Pick<
    MeetingEvent,
    "title" | "description" | "duration" | "locationType" | "locationDetails" | "themeColor"
  >
): Promise<MeetingEvent> {
  return fetchJSON("/api/meetings", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiUpdateMeeting(
  id: string,
  data: Partial<MeetingEvent>
): Promise<MeetingEvent> {
  return fetchJSON(`/api/meetings/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function apiDeleteMeeting(id: string): Promise<void> {
  await fetchJSON(`/api/meetings/${id}`, { method: "DELETE" });
}

// ── Availability ────────────────────────────────────────────

export async function apiGetAvailability(userId?: string): Promise<Availability[]> {
  const qs = userId ? `?userId=${userId}` : "";
  return fetchJSON(`/api/availability${qs}`);
}

export async function apiSaveAvailability(
  slots: Availability[]
): Promise<{ success: boolean }> {
  return fetchJSON("/api/availability", {
    method: "PUT",
    body: JSON.stringify({ slots }),
  });
}

// ── Bookings ────────────────────────────────────────────────

export async function apiGetBookings(eventId?: string): Promise<Booking[]> {
  const qs = eventId ? `?eventId=${eventId}` : "";
  return fetchJSON(`/api/bookings${qs}`);
}

export async function apiGetBookedSlots(
  eventId: string,
  date: string
): Promise<{ time: string; duration: number }[]> {
  return fetchJSON(`/api/bookings?eventId=${eventId}&date=${date}`);
}

export async function apiCreateBooking(data: {
  eventId: string;
  attendeeName: string;
  attendeeEmail: string;
  date: string;
  time: string;
  note?: string;
}): Promise<Booking> {
  return fetchJSON("/api/bookings", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiUpdateBookingStatus(
  id: string,
  status: Booking["status"]
): Promise<void> {
  await fetchJSON(`/api/bookings/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
