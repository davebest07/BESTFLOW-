"use client";

import { useEffect, useState } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { subscribeBookingsByHost, subscribeMeetingEventsByHost } from "@/lib/firestore";
import type { Booking, MeetingEvent } from "@/lib/types";
import { format, subDays, parseISO, getDay } from "date-fns";
import { BarChart2, TrendingUp, Users, XCircle, Clock, CalendarCheck, Sparkles, Loader2 } from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AnalyticsPage() {
  const { user, isLoading: authLoading } = useKindeBrowserClient();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [events, setEvents] = useState<MeetingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    let b = false, e = false;
    const done = () => { if (b && e) setLoading(false); };
    const u1 = subscribeBookingsByHost(user.id, (data) => { setBookings(data); b = true; done(); });
    const u2 = subscribeMeetingEventsByHost(user.id, (data) => { setEvents(data); e = true; done(); });
    return () => { u1(); u2(); };
  }, [user?.id]);

  if (authLoading || loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", gap: ".75rem", color: "var(--foreground-muted)", fontSize: ".9rem" }}>
        <Loader2 size={20} color="#7c3aed" style={{ animation: "spin 1s linear infinite" }} />
        Loading analytics…
      </div>
    );
  }

  const confirmed = bookings.filter(b => b.status === "confirmed");
  const cancelled = bookings.filter(b => b.status === "cancelled");
  const total = bookings.length;
  const cancelRate = total > 0 ? Math.round((cancelled.length / total) * 100) : 0;
  const avgDuration = confirmed.length > 0 ? Math.round(confirmed.reduce((s, b) => s + b.duration, 0) / confirmed.length) : 0;

  // Bookings last 14 days
  const today = new Date();
  const last14 = Array.from({ length: 14 }, (_, i) => {
    const d = subDays(today, 13 - i);
    const key = format(d, "yyyy-MM-dd");
    const label = format(d, "MMM d");
    const count = confirmed.filter(b => b.date === key).length;
    return { key, label, count };
  });
  const maxCount = Math.max(...last14.map(d => d.count), 1);

  // Peak day of week
  const byday = DAYS.map((label, i) => ({
    label,
    count: confirmed.filter(b => getDay(parseISO(b.date)) === i).length,
  }));
  const maxDay = Math.max(...byday.map(d => d.count), 1);

  // Peak hours
  const byHour = Array.from({ length: 24 }, (_, h) => ({
    label: h === 0 ? "12am" : h < 12 ? `${h}am` : h === 12 ? "12pm" : `${h - 12}pm`,
    count: confirmed.filter(b => parseInt(b.time.split(":")[0]) === h).length,
  })).filter(h => h.count > 0);
  const maxHour = Math.max(...byHour.map(h => h.count), 1);

  // Most booked event
  const eventCounts = events.map(ev => ({
    title: ev.title,
    count: confirmed.filter(b => b.eventId === ev.id).length,
    color: ev.themeColor,
  })).sort((a, b) => b.count - a.count);

  const statCards = [
    { icon: Users,        label: "Total Bookings",    value: total,              color: "#a78bfa", border: "rgba(167,139,250,.2)", bg: "rgba(167,139,250,.07)" },
    { icon: CalendarCheck,label: "Confirmed",         value: confirmed.length,   color: "#4ade80", border: "rgba(74,222,128,.2)",  bg: "rgba(74,222,128,.07)"  },
    { icon: XCircle,      label: "Cancelled",         value: cancelled.length,   color: "#f87171", border: "rgba(248,113,113,.2)", bg: "rgba(248,113,113,.07)" },
    { icon: TrendingUp,   label: "Cancel Rate",       value: `${cancelRate}%`,   color: "#fb923c", border: "rgba(251,146,60,.2)",  bg: "rgba(251,146,60,.07)"  },
    { icon: Clock,        label: "Avg Duration",      value: `${avgDuration}m`,  color: "#67e8f9", border: "rgba(103,232,249,.2)", bg: "rgba(103,232,249,.07)" },
    { icon: BarChart2,    label: "Event Types",       value: events.length,      color: "#e879f9", border: "rgba(232,121,249,.2)", bg: "rgba(232,121,249,.07)" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

      {/* Header */}
      <div className="dashboard-header-card" style={{ borderRadius: 18, background: "linear-gradient(135deg, #1a0533 0%, #0c1a2e 60%, #09090b 100%)", border: "1px solid rgba(139,92,246,.2)", padding: "2rem 2.25rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: 260, height: 160, background: "radial-gradient(circle, rgba(124,58,237,.25) 0%, transparent 70%)", filter: "blur(30px)", pointerEvents: "none" }} />
        <div style={{ display: "inline-flex", alignItems: "center", gap: ".4rem", padding: ".25rem .75rem", borderRadius: 999, background: "rgba(139,92,246,.15)", border: "1px solid rgba(139,92,246,.25)", fontSize: ".72rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#c4b5fd", marginBottom: ".85rem" }}>
          <Sparkles size={11} /> Analytics
        </div>
        <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, letterSpacing: "-.04em", lineHeight: 1.15, marginBottom: ".35rem" }}>
          Booking Analytics
        </h1>
        <p style={{ fontSize: ".88rem", color: "var(--foreground-muted)" }}>
          Insights into your scheduling patterns and performance.
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
        {statCards.map(s => (
          <div key={s.label} className="stat-card" style={{ borderRadius: 16, border: `1px solid ${s.border}`, background: s.bg, padding: "1.4rem 1.5rem" }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: s.bg, border: `1px solid ${s.border}`, display: "grid", placeItems: "center", marginBottom: "1rem" }}>
              <s.icon size={17} color={s.color} />
            </div>
            <p style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-.04em", color: s.color, lineHeight: 1, marginBottom: ".3rem" }}>{s.value}</p>
            <p style={{ fontSize: ".78rem", color: "var(--foreground-muted)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Bookings last 14 days bar chart */}
      <div style={{ borderRadius: 18, border: "1px solid var(--border)", background: "var(--card)", padding: "1.75rem" }}>
        <p style={{ fontSize: ".78rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--foreground-faint)", marginBottom: "1.5rem" }}>
          Confirmed bookings — last 14 days
        </p>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: 120 }}>
          {last14.map(d => (
            <div key={d.key} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div
                style={{
                  width: "100%",
                  height: d.count === 0 ? 4 : Math.max(8, (d.count / maxCount) * 100),
                  borderRadius: 6,
                  background: d.count === 0 ? "var(--border)" : "linear-gradient(180deg, #a78bfa, #7c3aed)",
                  transition: "height .3s ease",
                }}
              />
              {d.count > 0 && <span style={{ fontSize: ".6rem", color: "#a78bfa", fontWeight: 700 }}>{d.count}</span>}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "6px", marginTop: ".5rem" }}>
          {last14.map((d, i) => (
            <div key={d.key} style={{ flex: 1, textAlign: "center", fontSize: ".55rem", color: "var(--foreground-faint)", whiteSpace: "nowrap", overflow: "hidden" }}>
              {i % 2 === 0 ? d.label : ""}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>

        {/* Peak days of week */}
        <div style={{ borderRadius: 18, border: "1px solid var(--border)", background: "var(--card)", padding: "1.75rem" }}>
          <p style={{ fontSize: ".78rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--foreground-faint)", marginBottom: "1.25rem" }}>
            Bookings by day of week
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
            {byday.map(d => (
              <div key={d.label} style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                <span style={{ width: 32, fontSize: ".75rem", fontWeight: 700, color: "var(--foreground-muted)" }}>{d.label}</span>
                <div style={{ flex: 1, height: 8, borderRadius: 4, background: "var(--surface-raised)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(d.count / maxDay) * 100}%`, background: "linear-gradient(90deg, #7c3aed, #a78bfa)", borderRadius: 4, transition: "width .4s ease" }} />
                </div>
                <span style={{ fontSize: ".75rem", color: "var(--foreground-muted)", width: 20, textAlign: "right" }}>{d.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Most booked events */}
        <div style={{ borderRadius: 18, border: "1px solid var(--border)", background: "var(--card)", padding: "1.75rem" }}>
          <p style={{ fontSize: ".78rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--foreground-faint)", marginBottom: "1.25rem" }}>
            Most booked events
          </p>
          {eventCounts.length === 0 ? (
            <p style={{ fontSize: ".88rem", color: "var(--foreground-faint)", fontStyle: "italic" }}>No bookings yet</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
              {eventCounts.slice(0, 5).map(ev => (
                <div key={ev.title} style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: ev.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: ".85rem", fontWeight: 600, color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.title}</span>
                  <span style={{ fontSize: ".8rem", fontWeight: 700, color: "var(--foreground-muted)", background: "var(--surface-raised)", padding: ".2rem .6rem", borderRadius: 999, border: "1px solid var(--border)" }}>{ev.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Peak hours */}
      {byHour.length > 0 && (
        <div style={{ borderRadius: 18, border: "1px solid var(--border)", background: "var(--card)", padding: "1.75rem" }}>
          <p style={{ fontSize: ".78rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--foreground-faint)", marginBottom: "1.25rem" }}>
            Peak booking hours
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
            {byHour.map(h => (
              <div key={h.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: ".3rem", minWidth: 48 }}>
                <div style={{ width: 36, borderRadius: 6, background: "linear-gradient(180deg, #67e8f9, #0891b2)", height: Math.max(8, (h.count / maxHour) * 60) }} />
                <span style={{ fontSize: ".65rem", color: "var(--foreground-muted)", fontWeight: 600 }}>{h.label}</span>
                <span style={{ fontSize: ".65rem", color: "#67e8f9", fontWeight: 700 }}>{h.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Smart Availability Suggestions */}
      <div style={{ borderRadius: 18, border: "1px solid rgba(124,58,237,.2)", background: "linear-gradient(135deg, rgba(124,58,237,.06), rgba(147,51,234,.04))", padding: "1.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: ".75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(124,58,237,.15)", border: "1px solid rgba(124,58,237,.25)", display: "grid", placeItems: "center" }}>
              <Sparkles size={16} color="#a78bfa" />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: ".95rem", color: "var(--foreground)", margin: 0 }}>AI Availability Suggestions</p>
              <p style={{ fontSize: ".78rem", color: "var(--foreground-muted)", margin: 0 }}>Powered by GPT-4o-mini based on your booking patterns</p>
            </div>
          </div>
          <button
            onClick={async () => {
              setAiLoading(true);
              setAiSuggestion(null);
              try {
                const res = await fetch("/api/ai/suggest-availability");
                const data = await res.json();
                setAiSuggestion(data.suggestion ?? "No suggestions available.");
              } catch {
                setAiSuggestion("Failed to load suggestions. Please try again.");
              } finally {
                setAiLoading(false);
              }
            }}
            disabled={aiLoading}
            style={{
              display: "inline-flex", alignItems: "center", gap: ".5rem",
              padding: ".6rem 1.25rem",
              borderRadius: 10,
              fontSize: ".85rem",
              fontWeight: 700,
              cursor: aiLoading ? "not-allowed" : "pointer",
              background: aiLoading ? "var(--surface-raised)" : "linear-gradient(135deg, #7c3aed, #9333ea)",
              border: aiLoading ? "1px solid var(--border)" : "none",
              color: aiLoading ? "var(--foreground-muted)" : "#fff",
              boxShadow: aiLoading ? "none" : "0 4px 16px rgba(124,58,237,.35)",
              transition: "all .2s",
            }}
          >
            {aiLoading
              ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Analyzing…</>
              : <><Sparkles size={14} /> Get AI Suggestions</>
            }
          </button>
        </div>

        {aiSuggestion ? (
          <div style={{ borderRadius: 12, background: "var(--card)", border: "1px solid rgba(124,58,237,.15)", padding: "1.25rem 1.5rem" }}>
            <p style={{ fontSize: ".9rem", color: "var(--foreground)", lineHeight: 1.75, whiteSpace: "pre-wrap", margin: 0 }}>
              {aiSuggestion}
            </p>
          </div>
        ) : !aiLoading && (
          <p style={{ fontSize: ".85rem", color: "var(--foreground-faint)", fontStyle: "italic" }}>
            Click &ldquo;Get AI Suggestions&rdquo; to analyze your booking patterns and receive personalized availability recommendations.
          </p>
        )}
      </div>

    </div>
  );
}
