import { format, parse, addMinutes, isBefore } from "date-fns";

/**
 * Generate time slots between start and end, given a duration in minutes.
 */
export function generateTimeSlots(
  startTime: string,
  endTime: string,
  durationMinutes: number
): string[] {
  const slots: string[] = [];
  const base = new Date(2000, 0, 1); // arbitrary base date
  let current = parse(startTime, "HH:mm", base);
  const end = parse(endTime, "HH:mm", base);

  while (isBefore(addMinutes(current, durationMinutes), end) || 
         format(addMinutes(current, durationMinutes), "HH:mm") === endTime) {
    slots.push(format(current, "HH:mm"));
    current = addMinutes(current, durationMinutes);
  }

  return slots;
}

/**
 * Format a time string for display (e.g. "09:00" → "9:00 AM")
 */
export function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
}

/**
 * Copy link to clipboard
 */
export async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text);
}

/**
 * Get the base URL for public booking links
 */
export function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
}
