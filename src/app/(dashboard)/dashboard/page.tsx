"use client";

import { useState, useEffect } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { apiDeleteMeeting } from "@/lib/api-client";
import type { MeetingEvent, Booking } from "@/lib/types";
import MeetingEventList from "@/components/MeetingEventList";
import BookingList from "@/components/BookingList";
import {
  CalendarCheck,
  CalendarPlus,
  Loader2,
  CalendarClock,
  XCircle,
  ArrowRight,
  Sparkles,
  Copy,
  Check,
} from "lucide-react";
import Link from "next/link";
import {
  subscribeMeetingEventsByHost,
  subscribeBookingsByHost,
} from "@/lib/firestore";

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useKindeBrowserClient();
  const [events, setEvents] = useState<MeetingEvent[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"events" | "bookings">("events");
  const [copiedEventId, setCopiedEventId] = useState<string | null>(null);

  const handleCopyLink = async (eventId: string) => {
    const url = `${window.location.origin}/booking/${eventId}`;
    await navigator.clipboard.writeText(url);
    setCopiedEventId(eventId);
    setTimeout(() => setCopiedEventId(null), 2000);
  };

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    let eventsLoaded = false;
    let bookingsLoaded = false;
    const maybeDone = () => {
      if (eventsLoaded && bookingsLoaded) setLoading(false);
    };
    const unsubEvents = subscribeMeetingEventsByHost(user.id, (evts) => {
      setEvents(evts);
      eventsLoaded = true;
      maybeDone();
    });
    const unsubBookings = subscribeBookingsByHost(user.id, (bkgs) => {
      setBookings(bkgs);
      bookingsLoaded = true;
      maybeDone();
    });
    return () => { unsubEvents(); unsubBookings(); };
  }, [user?.id]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this meeting event?")) return;
    await apiDeleteMeeting(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  if (authLoading || loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
          gap: ".75rem",
          color: "var(--foreground-muted)",
          fontSize: ".9rem",
        }}
      >
        <Loader2
          size={20}
          style={{ animation: "spin 1s linear infinite", color: "#7c3aed" }}
        />
        Loading your dashboard…
      </div>
    );
  }

  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const cancelled = bookings.filter((b) => b.status === "cancelled").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

      {/* ── Header ── */}
      <div
        className="dashboard-header-card"
        style={{
          borderRadius: 18,
          background: "linear-gradient(135deg, #1a0533 0%, #0c1a2e 60%, #09090b 100%)",
          border: "1px solid rgba(139,92,246,.2)",
          padding: "2rem 2.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 260,
            height: 160,
            background: "radial-gradient(circle, rgba(124,58,237,.25) 0%, transparent 70%)",
            filter: "blur(30px)",
            pointerEvents: "none",
          }}
        />
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: ".4rem",
              padding: ".25rem .75rem",
              borderRadius: 999,
              background: "rgba(139,92,246,.15)",
              border: "1px solid rgba(139,92,246,.25)",
              fontSize: ".72rem",
              fontWeight: 700,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: "#c4b5fd",
              marginBottom: ".85rem",
            }}
          >
            <Sparkles size={11} />
            Dashboard
          </div>
          <h1
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: 800,
              letterSpacing: "-.04em",
              lineHeight: 1.15,
              marginBottom: ".35rem",
            }}
          >
            Welcome back{user?.given_name ? `, ${user.given_name}` : ""}!
          </h1>
          <p style={{ fontSize: ".88rem", color: "var(--foreground-muted)" }}>
            Manage your meeting events and view upcoming bookings.
          </p>
        </div>
        <Link
          href="/create-meeting"
          className="new-event-btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: ".5rem",
            padding: ".65rem 1.35rem",
            background: "linear-gradient(135deg, #7c3aed, #9333ea)",
            color: "#fff",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: ".88rem",
            boxShadow: "0 0 24px rgba(124,58,237,.35)",
            whiteSpace: "nowrap",
          }}
        >
          <CalendarPlus size={15} />
          New Event
        </Link>
      </div>

      {/* ── Stats ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
        }}
      >
        {[
          {
            icon: CalendarPlus,
            val: events.length,
            label: "Event Types",
            color: "#a78bfa",
            border: "rgba(167,139,250,.2)",
            bg: "rgba(167,139,250,.07)",
          },
          {
            icon: CalendarClock,
            val: confirmed,
            label: "Upcoming Bookings",
            color: "#67e8f9",
            border: "rgba(103,232,249,.2)",
            bg: "rgba(103,232,249,.07)",
          },
          {
            icon: XCircle,
            val: cancelled,
            label: "Cancelled",
            color: "#f87171",
            border: "rgba(248,113,113,.2)",
            bg: "rgba(248,113,113,.07)",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="stat-card"
            style={{
              borderRadius: 16,
              border: `1px solid ${s.border}`,
              background: s.bg,
              padding: "1.4rem 1.5rem",
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: `${s.bg}`,
                border: `1px solid ${s.border}`,
                display: "grid",
                placeItems: "center",
                marginBottom: "1rem",
              }}
            >
              <s.icon size={17} color={s.color} />
            </div>
            <p
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                letterSpacing: "-.04em",
                color: s.color,
                lineHeight: 1,
                marginBottom: ".3rem",
              }}
            >
              {s.val}
            </p>
            <p style={{ fontSize: ".78rem", color: "var(--foreground-muted)" }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div
        className="tab-bar"
        style={{
          display: "flex",
          gap: ".5rem",
          borderBottom: "1px solid var(--border)",
          paddingBottom: "0",
        }}
      >
        {(["events", "bookings"] as const).map((t) => {
          const active = tab === t;
          const Icon = t === "events" ? CalendarPlus : CalendarCheck;
          const label = t === "events" ? "My Events" : "Bookings";
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: ".5rem",
                padding: ".7rem 1.25rem",
                borderRadius: "10px 10px 0 0",
                fontSize: ".86rem",
                fontWeight: 600,
                cursor: "pointer",
                border: "none",
                outline: "none",
                transition: "all .15s",
                background: active ? "var(--active-bg)" : "transparent",
                borderBottom: active
                  ? "2px solid var(--primary)"
                  : "2px solid transparent",
                color: active ? "var(--active-color)" : "var(--foreground-muted)",
              }}
            >
              <Icon size={15} />
              {label}
            </button>
          );
        })}
      </div>

      {/* ── Content ── */}
      <div>
        {tab === "bookings" && bookings.length === 0 && events.length > 0 && (
        <div style={{ borderRadius: 18, border: "1px solid rgba(103,232,249,.15)", background: "rgba(103,232,249,.04)", padding: "2rem", marginBottom: "-.5rem" }}>
          <p style={{ fontSize: ".78rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#67e8f9", marginBottom: ".6rem" }}>No bookings yet</p>
          <p style={{ fontSize: ".9rem", color: "var(--foreground-muted)", marginBottom: "1.25rem" }}>Share your event links and bookings will appear here in realtime.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
            {events.map((ev) => (
              <div key={ev.id} style={{ display: "flex", alignItems: "center", gap: ".75rem", padding: ".75rem 1rem", borderRadius: 12, background: "var(--surface-raised)", border: "1px solid var(--border)" }}>
                <span style={{ flex: 1, fontSize: ".88rem", color: "var(--foreground)", fontWeight: 600 }}>{ev.title}</span>
                <button onClick={() => handleCopyLink(ev.id!)} style={{ display: "inline-flex", alignItems: "center", gap: ".4rem", padding: ".4rem .9rem", borderRadius: 8, background: copiedEventId === ev.id ? "rgba(74,222,128,.15)" : "rgba(255,255,255,.07)", border: copiedEventId === ev.id ? "1px solid rgba(74,222,128,.3)" : "1px solid rgba(255,255,255,.1)", color: copiedEventId === ev.id ? "#4ade80" : "rgba(255,255,255,.6)", fontWeight: 600, fontSize: ".78rem", cursor: "pointer" }}>
                  {copiedEventId === ev.id ? <Check size={12} /> : <Copy size={12} />}
                  {copiedEventId === ev.id ? "Copied!" : "Copy Link"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "events" ? (
          events.length === 0 ? (
            <div
              style={{
                borderRadius: 18,
                border: "1px dashed var(--border-strong)",
                background: "var(--surface)",
                padding: "4rem 2rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: "rgba(124,58,237,.12)",
                  border: "1px solid rgba(139,92,246,.2)",
                  display: "grid",
                  placeItems: "center",
                  margin: "0 auto 1.25rem",
                }}
              >
                <CalendarPlus size={24} color="#a78bfa" />
              </div>
              <p
                style={{
                  fontWeight: 700,
                  fontSize: "1rem",
                  marginBottom: ".5rem",
                }}
              >
                No meeting events yet
              </p>
              <p
                style={{
                  color: "var(--foreground-muted)",
                  fontSize: ".88rem",
                  marginBottom: "1.75rem",
                }}
              >
                Create your first event and start sharing your booking link.
              </p>
              <Link
                href="/create-meeting"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: ".5rem",
                  padding: ".65rem 1.5rem",
                  background: "rgba(124,58,237,.2)",
                  border: "1px solid rgba(139,92,246,.3)",
                  color: "#c4b5fd",
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: ".88rem",
                }}
              >
                Create your first event <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <MeetingEventList events={events} onDelete={handleDelete} />
          )
        ) : (
          <BookingList bookings={bookings} role="host" />
        )}
      </div>
    </div>
  );
}
