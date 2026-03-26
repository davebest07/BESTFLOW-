export interface MeetingEvent {
  id?: string;
  title: string;
  description: string;
  duration: number; // in minutes
  locationType: "google-meet" | "zoom" | "in-person" | "phone";
  locationDetails?: string;
  hostId: string;
  hostName: string;
  hostEmail: string;
  createdAt?: Date;
  themeColor: string;
}

export interface Availability {
  id?: string;
  userId: string;
  dayOfWeek: number; // 0‑6 (Sun-Sat)
  startTime: string; // "09:00"
  endTime: string;   // "17:00"
  isActive: boolean;
  bufferBefore?: number; // minutes buffer before meeting
  bufferAfter?: number;  // minutes buffer after meeting
}

export const BUFFER_OPTIONS = [0, 5, 10, 15, 30] as const;

export interface Booking {
  id?: string;
  eventId: string;
  hostId: string;
  attendeeName: string;
  attendeeEmail: string;
  date: string;       // "2026-03-25"
  time: string;       // "10:00"
  duration: number;
  status: "confirmed" | "cancelled" | "pending";
  note?: string;
  createdAt?: Date;
}

export const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120] as const;

export const THEME_COLORS = [
  "#6366f1", // Indigo
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#f43f5e", // Rose
  "#f97316", // Orange
  "#22c55e", // Green
  "#0ea5e9", // Sky
  "#14b8a6", // Teal
] as const;
