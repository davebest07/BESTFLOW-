"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiGetMeeting, apiUpdateMeeting } from "@/lib/api-client";
import type { MeetingEvent } from "@/lib/types";
import { DURATION_OPTIONS, THEME_COLORS } from "@/lib/types";
import { Loader2, CheckCircle2, Video, Phone, MapPin, Monitor, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

const LOCATION_OPTIONS = [
  { value: "google-meet", label: "Google Meet", icon: Monitor },
  { value: "zoom", label: "Zoom", icon: Video },
  { value: "phone", label: "Phone Call", icon: Phone },
  { value: "in-person", label: "In Person", icon: MapPin },
];

export default function EditMeetingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: 30,
    locationType: "google-meet" as MeetingEvent["locationType"],
    locationDetails: "",
    themeColor: THEME_COLORS[0] as string,
  });

  useEffect(() => {
    (async () => {
      try {
        const event = await apiGetMeeting(id);
        setForm({
          title: event.title,
          description: event.description,
          duration: event.duration,
          locationType: event.locationType,
          locationDetails: event.locationDetails ?? "",
          themeColor: event.themeColor,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiUpdateMeeting(id, form);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const fieldStyle: React.CSSProperties = {
    width: "100%",
    background: "var(--input-bg)",
    border: "1px solid var(--input-border)",
    borderRadius: 12,
    padding: ".75rem 1rem",
    fontSize: ".9rem",
    color: "var(--foreground)",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: ".8rem",
    fontWeight: 700,
    letterSpacing: ".04em",
    textTransform: "uppercase" as const,
    color: "var(--foreground-muted)",
    marginBottom: ".6rem",
  };

  const cardStyle: React.CSSProperties = {
    borderRadius: 16,
    border: "1px solid var(--border)",
    background: "var(--card)",
    padding: "1.5rem",
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", gap: ".75rem", color: "var(--foreground-muted)" }}>
        <Loader2 size={20} color="#7c3aed" style={{ animation: "spin 1s linear infinite" }} />
        Loading event…
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Header */}
      <div className="dashboard-header-card" style={{ borderRadius: 18, background: "linear-gradient(135deg, #1a0533 0%, #0c1a2e 60%, #09090b 100%)", border: "1px solid rgba(139,92,246,.2)", padding: "2rem 2.25rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: 220, height: 140, background: "radial-gradient(circle, rgba(124,58,237,.25) 0%, transparent 70%)", filter: "blur(28px)", pointerEvents: "none" }} />
        <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: ".4rem", fontSize: ".8rem", fontWeight: 600, color: "var(--foreground-muted)", marginBottom: "1rem" }}>
          <ArrowLeft size={13} /> Back to dashboard
        </Link>
        <div style={{ display: "inline-flex", alignItems: "center", gap: ".4rem", padding: ".25rem .75rem", borderRadius: 999, background: "rgba(139,92,246,.15)", border: "1px solid rgba(139,92,246,.25)", fontSize: ".72rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" as const, color: "#c4b5fd", marginBottom: ".85rem", marginLeft: ".5rem" }}>
          <Sparkles size={11} /> Edit Event
        </div>
        <h1 style={{ fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 800, letterSpacing: "-.04em", marginBottom: ".35rem" }}>Edit Meeting Event</h1>
        <p style={{ fontSize: ".88rem", color: "var(--foreground-muted)" }}>Update your event details below.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.75rem", maxWidth: 680 }}>

        <div style={cardStyle}>
          <label style={labelStyle}>Event Title</label>
          <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Quick Chat, Product Demo" style={fieldStyle} />
        </div>

        <div style={cardStyle}>
          <label style={labelStyle}>Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Briefly describe what this meeting is about..." rows={3} style={{ ...fieldStyle, resize: "none", lineHeight: 1.6 }} />
        </div>

        <div style={cardStyle}>
          <label style={labelStyle}>Duration</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: ".6rem" }}>
            {DURATION_OPTIONS.map((d) => {
              const active = form.duration === d;
              return (
                <button key={d} type="button" onClick={() => setForm({ ...form, duration: d })} style={{ padding: ".55rem 1.2rem", borderRadius: 10, fontSize: ".88rem", fontWeight: 600, cursor: "pointer", transition: "all .15s", background: active ? "var(--active-bg)" : "var(--surface-raised)", border: active ? "1px solid var(--active-border)" : "1px solid var(--border)", color: active ? "var(--active-color)" : "var(--foreground-muted)", boxShadow: active ? "0 0 12px rgba(124,58,237,.2)" : "none" }}>
                  {d} min
                </button>
              );
            })}
          </div>
        </div>

        <div style={cardStyle}>
          <label style={labelStyle}>Location / Meeting Type</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".6rem" }}>
            {LOCATION_OPTIONS.map((opt) => {
              const active = form.locationType === opt.value;
              return (
                <button key={opt.value} type="button" onClick={() => setForm({ ...form, locationType: opt.value as MeetingEvent["locationType"] })} style={{ display: "flex", alignItems: "center", gap: ".65rem", padding: ".75rem 1rem", borderRadius: 12, fontSize: ".88rem", fontWeight: 600, cursor: "pointer", transition: "all .15s", background: active ? "rgba(103,232,249,.1)" : "var(--surface-raised)", border: active ? "1px solid rgba(103,232,249,.35)" : "1px solid var(--border)", color: active ? "#0891b2" : "var(--foreground-muted)" }}>
                  <opt.icon size={16} />{opt.label}
                </button>
              );
            })}
          </div>
          {(form.locationType === "in-person" || form.locationType === "phone") && (
            <div style={{ marginTop: "1rem" }}>
              <label style={{ ...labelStyle, marginBottom: ".5rem" }}>{form.locationType === "phone" ? "Phone Number" : "Address"}</label>
              <input type="text" value={form.locationDetails} onChange={(e) => setForm({ ...form, locationDetails: e.target.value })} placeholder={form.locationType === "phone" ? "+1 (555) 000-0000" : "123 Main St"} style={fieldStyle} />
            </div>
          )}
        </div>

        <div style={cardStyle}>
          <label style={labelStyle}>Theme Color</label>
          <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
            {THEME_COLORS.map((color) => {
              const active = form.themeColor === color;
              return (
                <button key={color} type="button" onClick={() => setForm({ ...form, themeColor: color })} style={{ width: 38, height: 38, borderRadius: "50%", backgroundColor: color, border: active ? "3px solid var(--card)" : "3px solid transparent", outline: active ? `3px solid ${color}` : "3px solid transparent", outlineOffset: 2, cursor: "pointer", transition: "transform .15s", transform: active ? "scale(1.15)" : "scale(1)", display: "grid", placeItems: "center" }}>
                  {active && <CheckCircle2 size={16} color="#fff" />}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button type="submit" disabled={saving || !form.title} className="btn-glow" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: ".6rem", padding: ".85rem 2rem", background: saving || !form.title ? "var(--primary-light)" : "linear-gradient(135deg, #7c3aed, #9333ea)", color: saving || !form.title ? "var(--foreground-muted)" : "#fff", borderRadius: 12, fontWeight: 700, fontSize: ".95rem", cursor: saving || !form.title ? "not-allowed" : "pointer", border: "none", boxShadow: saving || !form.title ? "none" : "0 0 28px rgba(124,58,237,.4)", transition: "all .2s" }}>
            {saving && <Loader2 size={17} style={{ animation: "spin 1s linear infinite" }} />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
          <Link href="/dashboard" className="btn-glass" style={{ display: "inline-flex", alignItems: "center", padding: ".85rem 1.5rem", borderRadius: 12, border: "1px solid var(--border)", background: "var(--surface-raised)", color: "var(--foreground-muted)", fontWeight: 600, fontSize: ".9rem" }}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
