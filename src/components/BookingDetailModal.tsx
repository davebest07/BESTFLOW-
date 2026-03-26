"use client";

import { format } from "date-fns";
import { X, User, Mail, Calendar, Clock, FileText, MapPin, XCircle } from "lucide-react";
import type { Booking } from "@/lib/types";
import { formatTime } from "@/lib/utils";

interface BookingDetailModalProps {
  booking: Booking | null;
  onClose: () => void;
  onCancel: (id: string) => void;
}

export default function BookingDetailModal({ booking, onClose, onCancel }: BookingDetailModalProps) {
  if (!booking) return null;

  const confirmed = booking.status === "confirmed";
  const cancelled = booking.status === "cancelled";

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.55)",
        backdropFilter: "blur(6px)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 480,
          borderRadius: 22,
          background: "var(--card)",
          border: "1px solid var(--border-strong)",
          boxShadow: "var(--shadow-lg)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "1.5rem 1.5rem 1.25rem",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div>
            <p style={{
              fontSize: ".72rem",
              fontWeight: 700,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: "var(--foreground-faint)",
              marginBottom: ".3rem",
            }}>
              Booking Details
            </p>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, letterSpacing: "-.03em", color: "var(--foreground)" }}>
              {booking.attendeeName}
            </h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
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
              {booking.status}
            </span>
            <button
              onClick={onClose}
              className="modal-close-btn"
              style={{
                width: 34, height: 34, borderRadius: 9,
                background: "var(--surface-raised)",
                border: "1px solid var(--border)",
                display: "grid", placeItems: "center", cursor: "pointer",
              }}
            >
              <X size={15} color="var(--foreground-muted)" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[
            { icon: User,     label: "Attendee", value: booking.attendeeName },
            { icon: Mail,     label: "Email",    value: booking.attendeeEmail },
            { icon: Calendar, label: "Date",     value: format(new Date(booking.date), "EEEE, MMMM d, yyyy") },
            { icon: Clock,    label: "Time",     value: `${formatTime(booking.time)} · ${booking.duration} min` },
            { icon: MapPin,   label: "Event ID", value: booking.eventId },
          ].map((row) => (
            <div key={row.label} style={{ display: "flex", alignItems: "flex-start", gap: ".85rem" }}>
              <div style={{
                width: 34, height: 34, borderRadius: 9,
                background: "var(--surface-raised)",
                border: "1px solid var(--border)",
                display: "grid", placeItems: "center", flexShrink: 0,
              }}>
                <row.icon size={15} color="var(--foreground-faint)" />
              </div>
              <div>
                <p style={{ fontSize: ".72rem", fontWeight: 600, color: "var(--foreground-faint)", marginBottom: ".2rem", textTransform: "uppercase", letterSpacing: ".06em" }}>
                  {row.label}
                </p>
                <p style={{ fontSize: ".9rem", color: "var(--foreground)", fontWeight: 500 }}>{row.value}</p>
              </div>
            </div>
          ))}

          {booking.note && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: ".85rem" }}>
              <div style={{
                width: 34, height: 34, borderRadius: 9,
                background: "var(--surface-raised)",
                border: "1px solid var(--border)",
                display: "grid", placeItems: "center", flexShrink: 0,
              }}>
                <FileText size={15} color="var(--foreground-faint)" />
              </div>
              <div>
                <p style={{ fontSize: ".72rem", fontWeight: 600, color: "var(--foreground-faint)", marginBottom: ".2rem", textTransform: "uppercase", letterSpacing: ".06em" }}>Note</p>
                <p style={{ fontSize: ".88rem", color: "var(--foreground-muted)", fontStyle: "italic" }}>&ldquo;{booking.note}&rdquo;</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!cancelled && (
          <div style={{
            padding: "1rem 1.5rem 1.5rem",
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "flex-end",
            gap: ".75rem",
          }}>
            <button
              onClick={onClose}
              className="btn-glass"
              style={{
                padding: ".6rem 1.25rem",
                borderRadius: 10,
                background: "var(--surface-raised)",
                border: "1px solid var(--border)",
                color: "var(--foreground-muted)",
                fontWeight: 600,
                fontSize: ".85rem",
                cursor: "pointer",
              }}
            >
              Close
            </button>
            <button
              onClick={() => { onCancel(booking.id!); onClose(); }}
              className="modal-cancel-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: ".5rem",
                padding: ".6rem 1.25rem",
                borderRadius: 10,
                background: "rgba(220,38,38,.1)",
                border: "1px solid rgba(220,38,38,.2)",
                color: "var(--danger)",
                fontWeight: 600,
                fontSize: ".85rem",
                cursor: "pointer",
              }}
            >
              <XCircle size={14} /> Cancel Booking
            </button>
          </div>
        )}
        {cancelled && (
          <div style={{
            padding: "1rem 1.5rem 1.5rem",
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "flex-end",
          }}>
            <button
              onClick={onClose}
              className="btn-glass"
              style={{
                padding: ".6rem 1.25rem",
                borderRadius: 10,
                background: "var(--surface-raised)",
                border: "1px solid var(--border)",
                color: "var(--foreground-muted)",
                fontWeight: 600,
                fontSize: ".85rem",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
