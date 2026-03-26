"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Clock, MapPin, Calendar, Loader2, User } from "lucide-react";
import type { MeetingEvent } from "@/lib/types";

interface Profile { hostName: string; hostEmail: string; slug: string; }

export default function BookingProfilePage() {
  const { slug } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [events, setEvents] = useState<MeetingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/profile/${slug}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(({ profile, events }) => { setProfile(profile); setEvents(events); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "var(--background)", display: "flex", alignItems: "center", justifyContent: "center", gap: ".75rem", color: "var(--foreground-muted)" }}>
      <Loader2 size={22} color="#7c3aed" style={{ animation: "spin 1s linear infinite" }} />
      Loading…
    </div>
  );

  if (notFound) return (
    <div style={{ minHeight: "100vh", background: "var(--background)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem", padding: "2rem", textAlign: "center" }}>
      <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(248,113,113,.1)", border: "1px solid rgba(248,113,113,.2)", display: "grid", placeItems: "center", margin: "0 auto" }}>
        <User size={28} color="#f87171" />
      </div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--foreground)" }}>Profile not found</h1>
      <p style={{ color: "var(--foreground-muted)", fontSize: ".9rem" }}>The booking page <strong>/{slug}</strong> doesn&apos;t exist.</p>
      <Link href="/" style={{ padding: ".65rem 1.5rem", background: "linear-gradient(135deg,#7c3aed,#9333ea)", color: "#fff", borderRadius: 10, fontWeight: 700, fontSize: ".9rem" }}>Go Home</Link>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", color: "var(--foreground)", padding: "3rem 1.25rem" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem" }}>

        {/* Host header */}
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#9333ea)", display: "grid", placeItems: "center", margin: "0 auto 1rem", boxShadow: "0 0 32px rgba(124,58,237,.3)", border: "2px solid rgba(139,92,246,.4)" }}>
            <span style={{ fontSize: "1.6rem", fontWeight: 800, color: "#fff" }}>{profile?.hostName?.[0]?.toUpperCase()}</span>
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-.04em", marginBottom: ".35rem" }}>{profile?.hostName}</h1>
          <p style={{ fontSize: ".88rem", color: "var(--foreground-muted)" }}>Choose a meeting type below to get started.</p>
        </div>

        {/* Event cards */}
        {events.length === 0 ? (
          <div style={{ borderRadius: 18, border: "1px dashed var(--border-strong)", background: "var(--surface)", padding: "3rem 2rem", textAlign: "center", color: "var(--foreground-muted)", fontSize: ".9rem" }}>
            No meeting types available yet.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {events.map(ev => (
              <Link
                key={ev.id}
                href={`/booking/${ev.id}`}
                className="hover-card"
                style={{ borderRadius: 18, border: "1px solid var(--border)", background: "var(--card)", overflow: "hidden", display: "flex", flexDirection: "column", textDecoration: "none", boxShadow: "var(--shadow-sm)" }}
              >
                <div style={{ height: 4, background: ev.themeColor || "#7c3aed" }} />
                <div style={{ padding: "1.35rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                  <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--foreground)", marginBottom: ".4rem" }}>{ev.title}</h2>
                    {ev.description && (
                      <p style={{ fontSize: ".82rem", color: "var(--foreground-muted)", lineHeight: 1.5, marginBottom: ".75rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{ev.description}</p>
                    )}
                    <div style={{ display: "flex", gap: ".65rem", flexWrap: "wrap" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: ".3rem", padding: ".2rem .6rem", borderRadius: 999, background: "var(--primary-light)", border: "1px solid var(--active-border)", fontSize: ".72rem", fontWeight: 600, color: "var(--active-color)" }}>
                        <Clock size={10} /> {ev.duration} min
                      </span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: ".3rem", padding: ".2rem .6rem", borderRadius: 999, background: "var(--surface-raised)", border: "1px solid var(--border)", fontSize: ".72rem", fontWeight: 600, color: "var(--foreground-muted)", textTransform: "capitalize" }}>
                        <MapPin size={10} /> {ev.locationType.replace(/-/g, " ")}
                      </span>
                    </div>
                  </div>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--primary-light)", border: "1px solid var(--active-border)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                    <Calendar size={18} color="var(--active-color)" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <p style={{ textAlign: "center", fontSize: ".75rem", color: "var(--foreground-faint)" }}>
          Powered by <Link href="/" style={{ color: "var(--primary)", fontWeight: 700 }}>Bestflow</Link>
        </p>
      </div>
    </div>
  );
}
