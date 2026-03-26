import { Resend } from "resend";
import { formatTime } from "./utils";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

function getFrom() {
  return process.env.RESEND_FROM_EMAIL ?? "Bestflow <onboarding@resend.dev>";
}

interface BookingEmailParams {
  attendeeName: string;
  attendeeEmail: string;
  hostName: string;
  hostEmail: string;
  eventTitle: string;
  date: string;        // "2026-03-25"
  time: string;        // "10:00"
  duration: number;
  locationType: string;
}

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function sendReminderEmail(params: BookingEmailParams & { hoursUntil: number }) {
  const { attendeeName, attendeeEmail, hostName, eventTitle, date, time, duration, locationType, hoursUntil } = params;
  const formattedDate = formatDate(date);
  const formattedTime = formatTime(time);
  const location = locationType.replace(/-/g, " ");
  const timeLabel = hoursUntil === 1 ? "1 hour" : `${hoursUntil} hours`;

  const html = `
    <!DOCTYPE html><html><head><meta charset="utf-8"/></head>
    <body style="margin:0;padding:0;background:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      <div style="max-width:520px;margin:0 auto;padding:40px 20px;">
        <div style="background:linear-gradient(135deg,#1a0533,#0c1a2e);border:1px solid rgba(139,92,246,.3);border-radius:18px;padding:36px;color:#fff;">
          <div style="display:inline-block;background:rgba(139,92,246,.2);border:1px solid rgba(139,92,246,.3);border-radius:999px;padding:4px 12px;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#c4b5fd;margin-bottom:20px;">Bestflow Reminder</div>
          <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;letter-spacing:-.03em;">⏰ Meeting in ${timeLabel}</h1>
          <p style="color:rgba(255,255,255,.55);font-size:15px;line-height:1.6;margin:0 0 16px;">Hi <strong style="color:#fff">${attendeeName}</strong>, your meeting with <strong style="color:#fff">${hostName}</strong> is coming up soon.</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
            <tr><td style="padding:8px 0;color:#9ca3af;font-size:14px;border-bottom:1px solid #1f2937;">Event</td><td style="padding:8px 0;font-size:14px;font-weight:600;text-align:right;border-bottom:1px solid #1f2937;">${eventTitle}</td></tr>
            <tr><td style="padding:8px 0;color:#9ca3af;font-size:14px;border-bottom:1px solid #1f2937;">Date</td><td style="padding:8px 0;font-size:14px;font-weight:600;text-align:right;border-bottom:1px solid #1f2937;">${formattedDate}</td></tr>
            <tr><td style="padding:8px 0;color:#9ca3af;font-size:14px;border-bottom:1px solid #1f2937;">Time</td><td style="padding:8px 0;font-size:14px;font-weight:600;text-align:right;border-bottom:1px solid #1f2937;">${formattedTime}</td></tr>
            <tr><td style="padding:8px 0;color:#9ca3af;font-size:14px;border-bottom:1px solid #1f2937;">Duration</td><td style="padding:8px 0;font-size:14px;font-weight:600;text-align:right;border-bottom:1px solid #1f2937;">${duration} minutes</td></tr>
            <tr><td style="padding:8px 0;color:#9ca3af;font-size:14px;">Location</td><td style="padding:8px 0;font-size:14px;font-weight:600;text-align:right;text-transform:capitalize;">${location}</td></tr>
          </table>
          <p style="margin:24px 0 0;font-size:12px;color:rgba(255,255,255,.25);">Bestflow · Meeting Scheduler</p>
        </div>
      </div>
    </body></html>
  `;

  await getResend().emails.send({
    from: getFrom(),
    to: attendeeEmail,
    subject: `Reminder: "${eventTitle}" with ${hostName} in ${timeLabel}`,
    html,
  });
}

export async function sendBookingConfirmationEmails(params: BookingEmailParams) {
  const {
    attendeeName,
    attendeeEmail,
    hostName,
    hostEmail,
    eventTitle,
    date,
    time,
    duration,
    locationType,
  } = params;

  const formattedDate = formatDate(date);
  const formattedTime = formatTime(time);
  const location = locationType.replace(/-/g, " ");

  const detailsHtml = `
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <tr><td style="padding:8px 0;color:#9ca3af;font-size:14px;border-bottom:1px solid #1f2937;">Event</td><td style="padding:8px 0;font-size:14px;font-weight:600;text-align:right;border-bottom:1px solid #1f2937;">${eventTitle}</td></tr>
      <tr><td style="padding:8px 0;color:#9ca3af;font-size:14px;border-bottom:1px solid #1f2937;">Date</td><td style="padding:8px 0;font-size:14px;font-weight:600;text-align:right;border-bottom:1px solid #1f2937;">${formattedDate}</td></tr>
      <tr><td style="padding:8px 0;color:#9ca3af;font-size:14px;border-bottom:1px solid #1f2937;">Time</td><td style="padding:8px 0;font-size:14px;font-weight:600;text-align:right;border-bottom:1px solid #1f2937;">${formattedTime}</td></tr>
      <tr><td style="padding:8px 0;color:#9ca3af;font-size:14px;border-bottom:1px solid #1f2937;">Duration</td><td style="padding:8px 0;font-size:14px;font-weight:600;text-align:right;border-bottom:1px solid #1f2937;">${duration} minutes</td></tr>
      <tr><td style="padding:8px 0;color:#9ca3af;font-size:14px;">Location</td><td style="padding:8px 0;font-size:14px;font-weight:600;text-align:right;text-transform:capitalize;">${location}</td></tr>
    </table>
  `;

  const baseHtml = (title: string, body: string) => `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"/></head>
    <body style="margin:0;padding:0;background:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      <div style="max-width:520px;margin:0 auto;padding:40px 20px;">
        <div style="background:linear-gradient(135deg,#1a0533,#0c1a2e);border:1px solid rgba(139,92,246,.3);border-radius:18px;padding:36px;color:#fff;">
          <div style="display:inline-block;background:rgba(139,92,246,.2);border:1px solid rgba(139,92,246,.3);border-radius:999px;padding:4px 12px;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#c4b5fd;margin-bottom:20px;">
            Bestflow
          </div>
          <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;letter-spacing:-.03em;">${title}</h1>
          ${body}
          ${detailsHtml}
          <p style="margin:24px 0 0;font-size:12px;color:rgba(255,255,255,.25);">Bestflow · Meeting Scheduler</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const resend = getResend();
  const FROM = getFrom();

  // Send to attendee
  await resend.emails.send({
    from: FROM,
    to: attendeeEmail,
    subject: `Booking Confirmed: ${eventTitle} with ${hostName}`,
    html: baseHtml(
      "Your booking is confirmed! ✓",
      `<p style="color:rgba(255,255,255,.55);font-size:15px;line-height:1.6;margin:0 0 4px;">Hi <strong style="color:#fff">${attendeeName}</strong>, your meeting with <strong style="color:#fff">${hostName}</strong> has been scheduled.</p>`
    ),
  });

  // Send to host
  await resend.emails.send({
    from: FROM,
    to: hostEmail,
    subject: `New Booking: ${attendeeName} booked "${eventTitle}"`,
    html: baseHtml(
      "You have a new booking!",
      `<p style="color:rgba(255,255,255,.55);font-size:15px;line-height:1.6;margin:0 0 4px;"><strong style="color:#fff">${attendeeName}</strong> (<a href="mailto:${attendeeEmail}" style="color:#a78bfa;">${attendeeEmail}</a>) just booked <strong style="color:#fff">${eventTitle}</strong>.</p>`
    ),
  });
}
