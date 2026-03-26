"use client";

import { format } from "date-fns";
import { Calendar, Clock, User, Mail, XCircle, CheckCircle2, AlertCircle, ChevronRight } from "lucide-react";
import type { Booking } from "@/lib/types";
import { apiUpdateBookingStatus } from "@/lib/api-client";
import { formatTime } from "@/lib/utils";
import { useEffect, useState } from "react";
import BookingDetailModal from "./BookingDetailModal";

interface BookingListProps {
  bookings: Booking[];
  role: "host" | "attendee";
}

export default function BookingList({ bookings, role }: BookingListProps) {
  const [items, setItems] = useState(bookings);
  const [selected, setSelected] = useState<Booking | null>(null);

  useEffect(() => { setItems(bookings); }, [bookings]);

  const handleCancel = async (id: string) => {
    await apiUpdateBookingStatus(id, "cancelled");
    setItems((prev) => prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)));
  };

  if (items.length === 0) {
    return (
      <div style={{
        borderRadius: 18,
        border: "1px dashed var(--border-strong)",
        background: "var(--surface)",
        padding: "3.5rem 2rem",
        textAlign: "center",
        color: "var(--foreground-muted)",
        fontSize: ".9rem",
      }}>
        No bookings yet.
      </div>
    );
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
        {items.map((booking) => {
          const confirmed = booking.status === "confirmed";
          const cancelled = booking.status === "cancelled";

          return (
            <div
              key={booking.id}
              onClick={() => setSelected(booking)}
              className="booking-row"
              style={{
                borderRadius: 16,
                border: confirmed
                  ? "1px solid rgba(74,222,128,.2)"
                  : cancelled
                  ? "1px solid var(--border)"
                  : "1px solid rgba(251,191,36,.2)",
                background: confirmed
                  ? "rgba(74,222,128,.05)"
                  : cancelled
                  ? "var(--surface)"
                  : "rgba(251,191,36,.05)",
                padding: "1.1rem 1.35rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                opacity: cancelled ? 0.6 : 1,
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: ".45rem", flex: 1, minWidth: 0 }}>
                {/* Attendee name */}
                <div style={{ display: "flex", alignItems: "center", gap: ".5rem", fontSize: ".9rem", fontWeight: 700, color: "var(--foreground)" }}>
                  <User size={14} color="var(--foreground-faint)" />
                  {booking.attendeeName}
                </div>
                {/* Meta row */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: ".85rem", fontSize: ".78rem", color: "var(--foreground-muted)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: ".35rem" }}>
                    <Mail size={12} />{booking.attendeeEmail}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: ".35rem" }}>
                    <Calendar size={12} />{format(new Date(booking.date), "MMM d, yyyy")}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: ".35rem" }}>
                    <Clock size={12} />{formatTime(booking.time)} · {booking.duration} min
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: ".6rem", flexShrink: 0 }}>
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: ".35rem",
                  padding: ".3rem .75rem",
                  borderRadius: 999,
                  fontSize: ".72rem",
                  fontWeight: 700,
                  textTransform: "capitalize",
                  background: confirmed ? "rgba(74,222,128,.15)" : cancelled ? "rgba(248,113,113,.12)" : "rgba(251,191,36,.12)",
                  color: confirmed ? "#16a34a" : cancelled ? "var(--danger)" : "#d97706",
                  border: confirmed ? "1px solid rgba(74,222,128,.3)" : cancelled ? "1px solid rgba(248,113,113,.25)" : "1px solid rgba(251,191,36,.25)",
                }}>
                  {confirmed && <CheckCircle2 size={11} />}
                  {cancelled && <XCircle size={11} />}
                  {!confirmed && !cancelled && <AlertCircle size={11} />}
                  {booking.status}
                </span>
                <ChevronRight size={15} color="var(--foreground-faint)" />
              </div>
            </div>
          );
        })}
      </div>

      <BookingDetailModal
        booking={selected}
        onClose={() => setSelected(null)}
        onCancel={handleCancel}
      />
    </>
  );
}
