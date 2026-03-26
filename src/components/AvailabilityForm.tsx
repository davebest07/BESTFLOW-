"use client";

import { useState, useEffect } from "react";
import { DAYS_OF_WEEK, BUFFER_OPTIONS } from "@/lib/types";
import type { Availability } from "@/lib/types";
import { apiGetAvailability, apiSaveAvailability } from "@/lib/api-client";
import { Save, Loader2, CheckCircle2, Clock } from "lucide-react";

interface AvailabilityFormProps {
  userId: string;
}

const DEFAULT_START = "09:00";
const DEFAULT_END = "17:00";

export default function AvailabilityForm({ userId }: AvailabilityFormProps) {
  const [slots, setSlots] = useState<Availability[]>(
    DAYS_OF_WEEK.map((_, i) => ({
      userId,
      dayOfWeek: i,
      startTime: DEFAULT_START,
      endTime: DEFAULT_END,
      isActive: i >= 1 && i <= 5,
      bufferBefore: 0,
      bufferAfter: 0,
    }))
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showBuffer, setShowBuffer] = useState(false);

  useEffect(() => {
    (async () => {
      const existing = await apiGetAvailability();
      if (existing.length > 0) {
        setSlots(
          DAYS_OF_WEEK.map((_, i) => {
            const found = existing.find((s) => s.dayOfWeek === i);
            return found || { userId, dayOfWeek: i, startTime: DEFAULT_START, endTime: DEFAULT_END, isActive: false, bufferBefore: 0, bufferAfter: 0 };
          })
        );
      }
      setLoading(false);
    })();
  }, [userId]);

  const updateSlot = (index: number, updates: Partial<Availability>) => {
    setSlots((prev) => prev.map((s, i) => (i === index ? { ...s, ...updates } : s)));
    setSaved(false);
  };

  // Apply buffer to all active days at once
  const applyBufferAll = (field: "bufferBefore" | "bufferAfter", value: number) => {
    setSlots((prev) => prev.map((s) => ({ ...s, [field]: value })));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiSaveAvailability(slots);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const h = Math.floor(i / 2);
    const m = i % 2 === 0 ? "00" : "30";
    return `${h.toString().padStart(2, "0")}:${m}`;
  });

  const selectStyle: React.CSSProperties = {
    background: "var(--input-bg)",
    border: "1px solid var(--input-border)",
    borderRadius: 10,
    padding: ".5rem .5rem",
    fontSize: ".85rem",
    color: "var(--foreground)",
    outline: "none",
    cursor: "pointer",
    flex: 1,
    minWidth: 0,
    maxWidth: 110,
  };

  const globalBufferBefore = slots[0]?.bufferBefore ?? 0;
  const globalBufferAfter  = slots[0]?.bufferAfter  ?? 0;

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem", gap: ".75rem", color: "var(--foreground-muted)", fontSize: ".9rem" }}>
        <Loader2 size={20} style={{ animation: "spin 1s linear infinite", color: "#7c3aed" }} />
        Loading your availability…
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 680 }}>

      {/* Buffer time card */}
      <div style={{ borderRadius: 16, border: "1px solid var(--border)", background: "var(--card)", overflow: "hidden" }}>
        <button
          type="button"
          onClick={() => setShowBuffer(!showBuffer)}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", background: "none", border: "none", cursor: "pointer", color: "var(--foreground)" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: ".65rem" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(103,232,249,.1)", border: "1px solid rgba(103,232,249,.2)", display: "grid", placeItems: "center" }}>
              <Clock size={15} color="#0891b2" />
            </div>
            <div style={{ textAlign: "left" }}>
              <p style={{ fontSize: ".88rem", fontWeight: 700, color: "var(--foreground)" }}>Buffer Time</p>
              <p style={{ fontSize: ".75rem", color: "var(--foreground-muted)" }}>
                {globalBufferBefore > 0 || globalBufferAfter > 0
                  ? `${globalBufferBefore}min before · ${globalBufferAfter}min after`
                  : "No buffer set — click to configure"}
              </p>
            </div>
          </div>
          <span style={{ fontSize: ".8rem", color: "var(--foreground-faint)", transition: "transform .2s", transform: showBuffer ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
        </button>

        {showBuffer && (
          <div style={{ padding: "0 1.25rem 1.25rem", display: "flex", flexDirection: "column", gap: "1rem", borderTop: "1px solid var(--border)" }}>
            <p style={{ fontSize: ".75rem", color: "var(--foreground-faint)", marginTop: ".75rem" }}>Applied to all days. Prevents back-to-back bookings.</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {/* Buffer before */}
              <div>
                <p style={{ fontSize: ".75rem", fontWeight: 700, color: "var(--foreground-muted)", marginBottom: ".5rem", textTransform: "uppercase", letterSpacing: ".05em" }}>Before meeting</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: ".4rem" }}>
                  {BUFFER_OPTIONS.map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => applyBufferAll("bufferBefore", v)}
                      style={{ padding: ".35rem .75rem", borderRadius: 8, fontSize: ".8rem", fontWeight: 600, cursor: "pointer", border: "1px solid", background: globalBufferBefore === v ? "rgba(103,232,249,.15)" : "var(--surface-raised)", borderColor: globalBufferBefore === v ? "rgba(103,232,249,.4)" : "var(--border)", color: globalBufferBefore === v ? "#0891b2" : "var(--foreground-muted)" }}
                    >
                      {v === 0 ? "None" : `${v}m`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Buffer after */}
              <div>
                <p style={{ fontSize: ".75rem", fontWeight: 700, color: "var(--foreground-muted)", marginBottom: ".5rem", textTransform: "uppercase", letterSpacing: ".05em" }}>After meeting</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: ".4rem" }}>
                  {BUFFER_OPTIONS.map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => applyBufferAll("bufferAfter", v)}
                      style={{ padding: ".35rem .75rem", borderRadius: 8, fontSize: ".8rem", fontWeight: 600, cursor: "pointer", border: "1px solid", background: globalBufferAfter === v ? "rgba(103,232,249,.15)" : "var(--surface-raised)", borderColor: globalBufferAfter === v ? "rgba(103,232,249,.4)" : "var(--border)", color: globalBufferAfter === v ? "#0891b2" : "var(--foreground-muted)" }}
                    >
                      {v === 0 ? "None" : `${v}m`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Day rows */}
      {slots.map((slot, idx) => {
        const active = slot.isActive;
        return (
          <div
            key={slot.dayOfWeek}
            className="avail-row"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              borderRadius: 14,
              border: active ? "1px solid rgba(74,222,128,.25)" : "1px solid var(--border)",
              background: active ? "rgba(74,222,128,.05)" : "var(--card)",
              padding: "1rem 1.25rem",
            }}
          >
            {/* Toggle */}
            <button
              type="button"
              onClick={() => updateSlot(idx, { isActive: !active })}
              style={{ width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", position: "relative", flexShrink: 0, transition: "background .2s", background: active ? "rgba(74,222,128,.5)" : "var(--border-strong)" }}
            >
              <span style={{ position: "absolute", top: 3, left: active ? "calc(100% - 21px)" : 3, width: 18, height: 18, borderRadius: "50%", background: active ? "#4ade80" : "var(--foreground-faint)", transition: "left .2s, background .2s", boxShadow: active ? "0 0 6px rgba(74,222,128,.6)" : "none" }} />
            </button>

            {/* Day name */}
            <span style={{ width: 90, minWidth: 70, fontSize: ".88rem", fontWeight: 700, color: active ? "var(--foreground)" : "var(--foreground-muted)", flexShrink: 0, letterSpacing: "-.01em" }}>
              {DAYS_OF_WEEK[slot.dayOfWeek]}
            </span>

            {active ? (
              <div style={{ display: "flex", alignItems: "center", gap: ".5rem", flex: 1, minWidth: 0 }}>
                <select value={slot.startTime} onChange={(e) => updateSlot(idx, { startTime: e.target.value })} style={selectStyle}>
                  {timeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <span style={{ fontSize: ".8rem", color: "var(--foreground-faint)", fontWeight: 600 }}>to</span>
                <select value={slot.endTime} onChange={(e) => updateSlot(idx, { endTime: e.target.value })} style={selectStyle}>
                  {timeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            ) : (
              <span style={{ flex: 1, fontSize: ".85rem", color: "var(--foreground-faint)", fontStyle: "italic" }}>Unavailable</span>
            )}
          </div>
        );
      })}

      {/* Save button */}
      <div style={{ marginTop: ".5rem" }}>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-glow"
          style={{
            display: "inline-flex", alignItems: "center", gap: ".6rem",
            padding: ".8rem 1.75rem",
            background: saved ? "rgba(74,222,128,.15)" : saving ? "var(--primary-light)" : "linear-gradient(135deg, #7c3aed, #9333ea)",
            border: saved ? "1px solid rgba(74,222,128,.35)" : "1px solid transparent",
            color: saved ? "#16a34a" : saving ? "var(--foreground-muted)" : "#fff",
            borderRadius: 12, fontWeight: 700, fontSize: ".92rem",
            cursor: saving ? "not-allowed" : "pointer",
            boxShadow: saved || saving ? "none" : "0 0 28px rgba(124,58,237,.35)",
            transition: "all .2s",
          }}
        >
          {saving ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
          {saving ? "Saving…" : saved ? "Saved!" : "Save Availability"}
        </button>
      </div>
    </div>
  );
}
