"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiCreateMeeting } from "@/lib/api-client";
import type { MeetingEvent } from "@/lib/types";
import { DURATION_OPTIONS, THEME_COLORS } from "@/lib/types";
import { Loader2, CheckCircle2, Video, Phone, MapPin, Monitor, Sparkles } from "lucide-react";

interface MeetingFormProps {
  userId?: string;
  userName?: string;
  userEmail?: string;
}

const LOCATION_OPTIONS = [
  { value: "google-meet", label: "Google Meet", icon: Monitor },
  { value: "zoom", label: "Zoom", icon: Video },
  { value: "phone", label: "Phone Call", icon: Phone },
  { value: "in-person", label: "In Person", icon: MapPin },
];

export default function MeetingForm(_props: MeetingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: 30,
    locationType: "google-meet" as MeetingEvent["locationType"],
    locationDetails: "",
    themeColor: THEME_COLORS[0] as string,
  });

  const handleGenerateDescription = async () => {
    if (!form.title) return;
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: form.title, duration: form.duration, locationType: form.locationType }),
      });
      const data = await res.json();
      if (data.description) setForm(f => ({ ...f, description: data.description }));
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiCreateMeeting(form);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
    transition: "border-color .15s, box-shadow .15s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: ".8rem",
    fontWeight: 700,
    letterSpacing: ".04em",
    textTransform: "uppercase",
    color: "var(--foreground-muted)",
    marginBottom: ".6rem",
  };

  const cardStyle: React.CSSProperties = {
    borderRadius: 16,
    border: "1px solid var(--border)",
    background: "var(--card)",
    padding: "1.5rem",
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.75rem", maxWidth: 680 }}>

      {/* ── Event Title ── */}
      <div style={cardStyle}>
        <label style={labelStyle}>Event Title</label>
        <input
          type="text" required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="e.g. Quick Chat, Product Demo"
          style={fieldStyle}
        />
      </div>

      {/* ── Description ── */}
      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ".6rem" }}>
          <label style={{ ...labelStyle, marginBottom: 0 }}>Description</label>
          <button
            type="button"
            onClick={handleGenerateDescription}
            disabled={!form.title || aiLoading}
            title="Generate description with AI"
            style={{
              display: "inline-flex", alignItems: "center", gap: ".4rem",
              padding: ".35rem .85rem",
              borderRadius: 20,
              fontSize: ".78rem",
              fontWeight: 700,
              cursor: !form.title || aiLoading ? "not-allowed" : "pointer",
              background: "linear-gradient(135deg, rgba(124,58,237,.15), rgba(147,51,234,.1))",
              border: "1px solid rgba(124,58,237,.3)",
              color: !form.title || aiLoading ? "var(--foreground-muted)" : "#a78bfa",
              transition: "all .2s",
              opacity: !form.title ? 0.5 : 1,
            }}
          >
            {aiLoading
              ? <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} />
              : <Sparkles size={12} />
            }
            {aiLoading ? "Generating…" : "AI Generate"}
          </button>
        </div>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Briefly describe what this meeting is about… or click AI Generate ✨"
          rows={3}
          style={{ ...fieldStyle, resize: "none", lineHeight: 1.6 }}
        />
      </div>

      {/* ── Duration ── */}
      <div style={cardStyle}>
        <label style={labelStyle}>Duration</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: ".6rem" }}>
          {DURATION_OPTIONS.map((d) => {
            const active = form.duration === d;
            return (
              <button
                key={d} type="button"
                onClick={() => setForm({ ...form, duration: d })}
                className={`duration-pill ${active ? "duration-pill-active" : ""}`}
                style={{
                  padding: ".55rem 1.2rem",
                  borderRadius: 10,
                  fontSize: ".88rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  background: active ? "var(--active-bg)" : "var(--surface-raised)",
                  border: active ? "1px solid var(--active-border)" : "1px solid var(--border)",
                  color: active ? "var(--active-color)" : "var(--foreground-muted)",
                  boxShadow: active ? "0 0 12px rgba(124,58,237,.2)" : "none",
                }}
              >
                {d} min
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Location ── */}
      <div style={cardStyle}>
        <label style={labelStyle}>Location / Meeting Type</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".6rem" }}>
          {LOCATION_OPTIONS.map((opt) => {
            const active = form.locationType === opt.value;
            return (
              <button
                key={opt.value} type="button"
                onClick={() => setForm({ ...form, locationType: opt.value as MeetingEvent["locationType"] })}
                className={`loc-btn ${active ? "loc-btn-active" : ""}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: ".65rem",
                  padding: ".75rem 1rem",
                  borderRadius: 12,
                  fontSize: ".88rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  background: active ? "rgba(103,232,249,.1)" : "var(--surface-raised)",
                  border: active ? "1px solid rgba(103,232,249,.35)" : "1px solid var(--border)",
                  color: active ? "#0891b2" : "var(--foreground-muted)",
                }}
              >
                <opt.icon size={16} />
                {opt.label}
              </button>
            );
          })}
        </div>

        {(form.locationType === "in-person" || form.locationType === "phone") && (
          <div style={{ marginTop: "1rem" }}>
            <label style={{ ...labelStyle, marginBottom: ".5rem" }}>
              {form.locationType === "phone" ? "Phone Number" : "Address / Location"}
            </label>
            <input
              type="text"
              value={form.locationDetails}
              onChange={(e) => setForm({ ...form, locationDetails: e.target.value })}
              placeholder={form.locationType === "phone" ? "+1 (555) 000-0000" : "123 Main St, Suite 100"}
              style={fieldStyle}
            />
          </div>
        )}
      </div>

      {/* ── Theme Color ── */}
      <div style={cardStyle}>
        <label style={labelStyle}>Theme Color</label>
        <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
          {THEME_COLORS.map((color) => {
            const active = form.themeColor === color;
            return (
              <button
                key={color} type="button"
                onClick={() => setForm({ ...form, themeColor: color })}
                style={{
                  width: 38, height: 38, borderRadius: "50%",
                  backgroundColor: color,
                  border: active ? "3px solid var(--card)" : "3px solid transparent",
                  outline: active ? `3px solid ${color}` : "3px solid transparent",
                  outlineOffset: 2,
                  cursor: "pointer",
                  transition: "transform .15s",
                  transform: active ? "scale(1.15)" : "scale(1)",
                  display: "grid", placeItems: "center",
                }}
              >
                {active && <CheckCircle2 size={16} color="#fff" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Submit ── */}
      <button
        type="submit"
        disabled={loading || !form.title}
        className="btn-glow"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: ".6rem",
          padding: ".85rem 2rem",
          background: loading || !form.title ? "var(--primary-light)" : "linear-gradient(135deg, #7c3aed, #9333ea)",
          color: loading || !form.title ? "var(--foreground-muted)" : "#fff",
          borderRadius: 12,
          fontWeight: 700,
          fontSize: ".95rem",
          cursor: loading || !form.title ? "not-allowed" : "pointer",
          border: "none",
          boxShadow: loading || !form.title ? "none" : "0 0 28px rgba(124,58,237,.4)",
          transition: "all .2s",
          alignSelf: "flex-start",
        }}
      >
        {loading && <Loader2 size={17} style={{ animation: "spin 1s linear infinite" }} />}
        {loading ? "Creating…" : "Create Meeting Event"}
      </button>
    </form>
  );
}
