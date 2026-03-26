"use client";

import Link from "next/link";
import { Trash2, Copy, ExternalLink, Check, Clock, MapPin, Pencil } from "lucide-react";
import type { MeetingEvent } from "@/lib/types";
import { copyToClipboard, getBaseUrl } from "@/lib/utils";
import { useState } from "react";

interface MeetingEventListProps {
  events: MeetingEvent[];
  onDelete: (id: string) => void;
}

export default function MeetingEventList({ events, onDelete }: MeetingEventListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (eventId: string) => {
    const url = `${getBaseUrl()}/booking/${eventId}`;
    await copyToClipboard(url);
    setCopiedId(eventId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (events.length === 0) return null;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "1rem",
      }}
    >
      {events.map((event) => (
        <div
          key={event.id}
          className="hover-card"
          style={{
            borderRadius: 18,
            border: "1px solid var(--border)",
            background: "var(--card)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {/* Color accent bar */}
          <div
            style={{
              height: 4,
              background: event.themeColor || "#7c3aed",
              flexShrink: 0,
            }}
          />

          <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
            {/* Title */}
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                letterSpacing: "-.025em",
                marginBottom: ".4rem",
                color: "var(--foreground)",
              }}
            >
              {event.title}
            </h3>

            {/* Description */}
            {event.description && (
              <p
                style={{
                  fontSize: ".83rem",
                  color: "var(--foreground-muted)",
                  lineHeight: 1.55,
                  marginBottom: ".85rem",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {event.description}
              </p>
            )}

            {/* Meta pills */}
            <div
              style={{
                display: "flex",
                gap: ".5rem",
                flexWrap: "wrap",
                marginBottom: "1.1rem",
                marginTop: "auto",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: ".3rem",
                  padding: ".25rem .65rem",
                  borderRadius: 999,
                  background: "var(--primary-light)",
                  border: "1px solid var(--active-border)",
                  fontSize: ".72rem",
                  fontWeight: 600,
                  color: "var(--active-color)",
                }}
              >
                <Clock size={11} />
                {event.duration} min
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: ".3rem",
                  padding: ".25rem .65rem",
                  borderRadius: 999,
                  background: "var(--surface-raised)",
                  border: "1px solid var(--border)",
                  fontSize: ".72rem",
                  fontWeight: 600,
                  color: "var(--foreground-muted)",
                  textTransform: "capitalize",
                }}
              >
                <MapPin size={11} />
                {event.locationType.replace("-", " ")}
              </span>
            </div>

            {/* Action row */}
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
              <button
                onClick={() => handleCopy(event.id!)}
                className="copy-btn"
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: ".45rem",
                  padding: ".55rem .75rem",
                  borderRadius: 10,
                  fontSize: ".8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  border: "1px solid var(--border)",
                  background: copiedId === event.id
                    ? "rgba(74,222,128,.15)"
                    : "var(--surface-raised)",
                  color: copiedId === event.id ? "#16a34a" : "var(--foreground-muted)",
                }}
              >
                {copiedId === event.id ? <Check size={13} /> : <Copy size={13} />}
                {copiedId === event.id ? "Copied!" : "Copy Link"}
              </button>

              <Link
                href={`/edit-meeting/${event.id}`}
                className="icon-btn icon-btn-edit"
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "var(--surface-raised)",
                  border: "1px solid var(--border)",
                  display: "grid", placeItems: "center", flexShrink: 0,
                }}
                title="Edit event"
              >
                <Pencil size={14} color="var(--primary)" />
              </Link>

              <Link
                href={`/booking/${event.id}`}
                target="_blank"
                className="icon-btn icon-btn-external"
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "var(--surface-raised)",
                  border: "1px solid var(--border)",
                  display: "grid", placeItems: "center", flexShrink: 0,
                }}
                title="Preview booking page"
              >
                <ExternalLink size={14} color="var(--accent)" />
              </Link>

              <button
                onClick={() => onDelete(event.id!)}
                className="icon-btn icon-btn-delete"
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "var(--surface-raised)",
                  border: "1px solid var(--border)",
                  display: "grid", placeItems: "center", flexShrink: 0,
                  cursor: "pointer",
                }}
                title="Delete event"
              >
                <Trash2 size={14} color="var(--danger)" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
