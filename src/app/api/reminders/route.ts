import { NextResponse } from "next/server";
import { db, collection, getDocs, query, where } from "@/lib/firebase";
import { getMeetingEvent } from "@/lib/firestore";
import { sendReminderEmail } from "@/lib/email";
import type { Booking } from "@/lib/types";

// GET /api/reminders
// Call this endpoint from a cron service (e.g. Vercel Cron, Upstash) every hour.
// It sends reminder emails for bookings happening in ~24h and ~1h.
export async function GET(req: Request) {
  const secret = req.headers.get("x-cron-secret");
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const targets = [
    { hoursUntil: 24, label: "24h" },
    { hoursUntil: 1,  label: "1h"  },
  ];

  let sent = 0;
  const errors: string[] = [];

  for (const { hoursUntil, label } of targets) {
    const target = new Date(now.getTime() + hoursUntil * 60 * 60 * 1000);
    const targetDate = target.toISOString().split("T")[0]; // "yyyy-MM-dd"
    const targetHour = target.getHours().toString().padStart(2, "0");
    const targetMin  = target.getMinutes() < 30 ? "00" : "30";
    const targetTime = `${targetHour}:${targetMin}`;

    const q = query(
      collection(db, "bookings"),
      where("date",   "==", targetDate),
      where("time",   "==", targetTime),
      where("status", "==", "confirmed")
    );
    const snap = await getDocs(q);
    const bookings = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Booking[];

    for (const booking of bookings) {
      try {
        const event = await getMeetingEvent(booking.eventId);
        if (!event) continue;
        await sendReminderEmail({
          attendeeName:  booking.attendeeName,
          attendeeEmail: booking.attendeeEmail,
          hostName:      event.hostName,
          hostEmail:     event.hostEmail,
          eventTitle:    event.title,
          date:          booking.date,
          time:          booking.time,
          duration:      booking.duration,
          locationType:  event.locationType,
          hoursUntil,
        });
        sent++;
      } catch (err) {
        errors.push(`${booking.id}: ${err}`);
      }
    }
    console.log(`[reminders] ${label}: found ${bookings.length} bookings, sent ${sent} so far`);
  }

  return NextResponse.json({ sent, errors });
}
