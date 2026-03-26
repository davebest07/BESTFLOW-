"use client";

import { useState, useEffect } from "react";
import { format, isBefore, startOfDay } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { Calendar, Clock, MapPin, User, CheckCircle2, Loader2, ArrowLeft, Mail, Globe, MessageCircle, X, Send, Bot } from "lucide-react";
import type { MeetingEvent, Availability } from "@/lib/types";
import { apiCreateBooking } from "@/lib/api-client";
import { generateTimeSlots, formatTime } from "@/lib/utils";
import { subscribeAvailabilityByUserId, subscribeBookedSlotsByEventAndDate } from "@/lib/firestore";

interface BookingViewProps {
  event: MeetingEvent;
}

export default function BookingView({ event }: BookingViewProps) {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [step, setStep] = useState<"date" | "time" | "details" | "confirmed">("date");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", note: "" });

  // AI Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: `Hi! I'm your AI assistant. Ask me anything about the "${event.title}" meeting.` },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeAvailabilityByUserId(event.hostId, (slots) => {
      setAvailability(slots);
      setLoading(false);
    });
    return () => unsub();
  }, [event.hostId]);

  useEffect(() => {
    if (!selectedDate || !event.id) return;
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const unsub = subscribeBookedSlotsByEventAndDate(event.id!, dateStr, (slots) =>
      setBookedTimes(slots.map((s) => s.time))
    );
    return () => unsub();
  }, [selectedDate, event.id]);

  const activeDays = availability.filter((a) => a.isActive).map((a) => a.dayOfWeek);
  const isDayDisabled = (day: Date) => {
    if (isBefore(day, startOfDay(new Date()))) return true;
    return !activeDays.includes(day.getDay());
  };

  const getSlots = () => {
    if (!selectedDate) return [];
    const dayAvail = availability.find((a) => a.dayOfWeek === selectedDate.getDay() && a.isActive);
    if (!dayAvail) return [];
    const all = generateTimeSlots(dayAvail.startTime, dayAvail.endTime, event.duration);
    return all.filter((s) => !bookedTimes.includes(s));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(null);
    if (date) setStep("time");
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep("details");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;
    setSubmitting(true);
    try {
      await apiCreateBooking({
        eventId: event.id!,
        attendeeName: form.name,
        attendeeEmail: form.email,
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
        note: form.note,
      });
      setStep("confirmed");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChatSend = async () => {
    const msg = chatInput.trim();
    if (!msg || chatLoading) return;
    setChatMessages(prev => [...prev, { role: "user", text: msg }]);
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          eventTitle: event.title,
          eventDescription: event.description,
          duration: event.duration,
          locationType: event.locationType,
          hostName: event.hostName,
        }),
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { role: "ai", text: data.reply ?? "Sorry, I couldn't get a response." }]);
    } catch {
      setChatMessages(prev => [...prev, { role: "ai", text: "Oops, something went wrong. Please try again." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
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
    fontSize: ".78rem",
    fontWeight: 700,
    letterSpacing: ".04em",
    textTransform: "uppercase" as const,
    color: "var(--foreground-muted)",
    marginBottom: ".5rem",
  };

  // ── Loading ──────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--background)", display: "flex", alignItems: "center", justifyContent: "center", gap: ".75rem", color: "var(--foreground-muted)", fontSize: ".9rem" }}>
        <Loader2 size={22} color="#7c3aed" style={{ animation: "spin 1s linear infinite" }} />
        Loading event…
      </div>
    );
  }

  // ── Confirmed ────────────────────────────────────────────
  if (step === "confirmed") {
    return (
      <div style={{ minHeight: "100vh", background: "var(--background)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ maxWidth: 460, width: "100%", borderRadius: 24, border: "1px solid rgba(74,222,128,.25)", background: "rgba(74,222,128,.05)", padding: "3rem 2.5rem", textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(74,222,128,.15)", border: "1px solid rgba(74,222,128,.3)", display: "grid", placeItems: "center", margin: "0 auto 1.5rem" }}>
            <CheckCircle2 size={34} color="#16a34a" />
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-.04em", marginBottom: ".6rem", color: "var(--foreground)" }}>
            Booking Confirmed!
          </h1>
          <p style={{ color: "var(--foreground-muted)", marginBottom: "2rem", fontSize: ".9rem" }}>
            Your meeting with <strong style={{ color: "var(--foreground)" }}>{event.hostName}</strong> has been scheduled.
          </p>
          <div style={{ borderRadius: 14, border: "1px solid var(--border)", background: "var(--card)", padding: "1.25rem", textAlign: "left", display: "flex", flexDirection: "column", gap: ".65rem" }}>
            {[
              { label: "Event",    value: event.title },
              { label: "Date",     value: selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : "" },
              { label: "Time",     value: selectedTime ? formatTime(selectedTime) : "" },
              { label: "Duration", value: `${event.duration} minutes` },
            ].map((row) => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: ".88rem" }}>
                <span style={{ color: "var(--foreground-muted)", fontWeight: 600 }}>{row.label}</span>
                <span style={{ color: "var(--foreground)", fontWeight: 600 }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const slots = getSlots();

  // ── Main booking UI ──────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", color: "var(--foreground)", padding: "2rem 1.25rem", display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
      {/* Ambient glow */}
      <div style={{ position: "fixed", top: "15%", left: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,.1) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />

      <div
        style={{ width: "100%", maxWidth: 960, display: "grid", gridTemplateColumns: "300px 1fr", gap: "1.5rem", alignItems: "start", position: "relative", paddingTop: "3rem" }}
        className="booking-grid"
      >
        {/* ── Left: Event Info ── */}
        <div style={{ borderRadius: 20, border: "1px solid var(--border)", background: "var(--card)", overflow: "hidden", position: "sticky", top: "2rem", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ height: 4, background: event.themeColor || "#7c3aed" }} />
          <div style={{ padding: "1.5rem" }}>
            <p style={{ fontSize: ".78rem", color: "var(--foreground-faint)", marginBottom: ".35rem", fontWeight: 600 }}>
              {event.hostName}
            </p>
            <h1 style={{ fontSize: "1.25rem", fontWeight: 800, letterSpacing: "-.03em", marginBottom: ".75rem", color: "var(--foreground)" }}>
              {event.title}
            </h1>
            {event.description && (
              <p style={{ fontSize: ".85rem", color: "var(--foreground-muted)", lineHeight: 1.6, marginBottom: "1.1rem" }}>
                {event.description}
              </p>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
              {[
                { icon: Clock,    text: `${event.duration} min` },
                { icon: MapPin,   text: event.locationType.replace(/-/g, " ") },
                ...(selectedDate ? [{ icon: Calendar, text: format(selectedDate, "EEE, MMM d") }] : []),
                ...(selectedTime ? [{ icon: Clock,    text: formatTime(selectedTime) }] : []),
                { icon: Globe,    text: timezone },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: ".6rem", fontSize: ".85rem", color: "var(--foreground-muted)", textTransform: "capitalize" }}>
                  <item.icon size={14} color="var(--foreground-faint)" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Steps ── */}
        <div style={{ borderRadius: 20, border: "1px solid var(--border)", background: "var(--card)", padding: "1.75rem", boxShadow: "var(--shadow-sm)" }}>

          {/* Step: Date */}
          {step === "date" && (
            <div>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, letterSpacing: "-.025em", marginBottom: "1.25rem", color: "var(--foreground)" }}>
                Select a Date
              </h2>
              <style>{`
                .rdp { --rdp-accent-color: #7c3aed !important; --rdp-background-color: rgba(124,58,237,.15) !important; }
                [data-theme="dark"] .rdp { color: #fff !important; }
                [data-theme="dark"] .rdp-day { color: rgba(255,255,255,.75) !important; }
                [data-theme="dark"] .rdp-day_disabled { color: rgba(255,255,255,.2) !important; }
                [data-theme="dark"] .rdp-caption_label { color: #fff !important; font-weight: 700 !important; }
                [data-theme="dark"] .rdp-head_cell { color: rgba(255,255,255,.4) !important; font-size: .72rem !important; }
                [data-theme="dark"] .rdp-nav_button { color: rgba(255,255,255,.5) !important; }
                [data-theme="light"] .rdp { color: #18181b !important; }
                [data-theme="light"] .rdp-day_disabled { color: rgba(0,0,0,.25) !important; }
                [data-theme="light"] .rdp-caption_label { color: #18181b !important; font-weight: 700 !important; }
              `}</style>
              <DayPicker mode="single" selected={selectedDate} onSelect={handleDateSelect} disabled={isDayDisabled} />
            </div>
          )}

          {/* Step: Time */}
          {step === "time" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, letterSpacing: "-.025em", color: "var(--foreground)" }}>Select a Time</h2>
                <button onClick={() => setStep("date")} style={{ display: "inline-flex", alignItems: "center", gap: ".35rem", fontSize: ".8rem", fontWeight: 600, color: "var(--primary)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  <ArrowLeft size={13} /> Change date
                </button>
              </div>

              {slots.length === 0 ? (
                <div style={{ padding: "3rem 0", textAlign: "center", color: "var(--foreground-muted)", fontSize: ".88rem" }}>
                  No available slots for this date. Try another day.
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: ".6rem", maxHeight: 320, overflowY: "auto" }}>
                  {slots.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleTimeSelect(time)}
                      className="time-slot"
                      style={{ padding: ".6rem .5rem", borderRadius: 10, fontSize: ".85rem", fontWeight: 600, cursor: "pointer", border: "1px solid var(--border)", background: "var(--surface-raised)", color: "var(--foreground-muted)" }}
                    >
                      {formatTime(time)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step: Details */}
          {step === "details" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, letterSpacing: "-.025em", color: "var(--foreground)" }}>Your Details</h2>
                <button onClick={() => setStep("time")} style={{ display: "inline-flex", alignItems: "center", gap: ".35rem", fontSize: ".8rem", fontWeight: 600, color: "var(--primary)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  <ArrowLeft size={13} /> Change time
                </button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <label style={labelStyle}>Name *</label>
                  <div style={{ position: "relative" }}>
                    <User size={15} color="var(--foreground-faint)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                    <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" style={{ ...inputStyle, paddingLeft: "2.5rem" }} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Email *</label>
                  <div style={{ position: "relative" }}>
                    <Mail size={15} color="var(--foreground-faint)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" style={{ ...inputStyle, paddingLeft: "2.5rem" }} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Note (optional)</label>
                  <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Anything the host should know?" rows={3} style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }} />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-glow"
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: ".6rem", padding: ".85rem", background: submitting ? "var(--primary-light)" : "linear-gradient(135deg, #7c3aed, #9333ea)", color: submitting ? "var(--foreground-muted)" : "#fff", borderRadius: 12, fontWeight: 700, fontSize: ".95rem", cursor: submitting ? "not-allowed" : "pointer", border: "none", boxShadow: submitting ? "none" : "0 0 28px rgba(124,58,237,.35)" }}
                >
                  {submitting && <Loader2 size={17} style={{ animation: "spin 1s linear infinite" }} />}
                  {submitting ? "Confirming…" : "Confirm Booking"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* ── AI Chat Widget ── */}
      {/* Floating button */}
      <button
        onClick={() => setChatOpen(o => !o)}
        title="Ask AI about this meeting"
        style={{
          position: "fixed",
          bottom: "1.75rem",
          right: "1.75rem",
          width: 54,
          height: 54,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #7c3aed, #9333ea)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 24px rgba(124,58,237,.5)",
          zIndex: 9999,
          transition: "transform .2s",
        }}
      >
        {chatOpen ? <X size={22} color="#fff" /> : <MessageCircle size={22} color="#fff" />}
      </button>

      {/* Chat Panel */}
      {chatOpen && (
        <div style={{
          position: "fixed",
          bottom: "5.5rem",
          right: "1.75rem",
          width: 340,
          maxHeight: 440,
          borderRadius: 20,
          border: "1px solid rgba(124,58,237,.25)",
          background: "var(--card)",
          boxShadow: "0 8px 40px rgba(0,0,0,.35)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          zIndex: 9998,
        }}>
          {/* Header */}
          <div style={{ padding: ".85rem 1.1rem", background: "linear-gradient(135deg, #7c3aed, #9333ea)", display: "flex", alignItems: "center", gap: ".6rem" }}>
            <Bot size={18} color="#fff" />
            <div>
              <p style={{ fontWeight: 700, fontSize: ".88rem", color: "#fff", margin: 0 }}>AI Meeting Assistant</p>
              <p style={{ fontSize: ".72rem", color: "rgba(255,255,255,.7)", margin: 0 }}>Ask anything about this meeting</p>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: ".85rem 1rem", display: "flex", flexDirection: "column", gap: ".65rem" }}>
            {chatMessages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "82%",
                  padding: ".55rem .85rem",
                  borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  background: msg.role === "user" ? "linear-gradient(135deg, #7c3aed, #9333ea)" : "var(--surface-raised)",
                  border: msg.role === "user" ? "none" : "1px solid var(--border)",
                  color: msg.role === "user" ? "#fff" : "var(--foreground)",
                  fontSize: ".83rem",
                  lineHeight: 1.5,
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ padding: ".55rem .85rem", borderRadius: "14px 14px 14px 4px", background: "var(--surface-raised)", border: "1px solid var(--border)", display: "flex", gap: ".3rem", alignItems: "center" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed", animation: "pulse 1.2s ease-in-out infinite" }} />
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed", animation: "pulse 1.2s ease-in-out .4s infinite" }} />
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed", animation: "pulse 1.2s ease-in-out .8s infinite" }} />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ padding: ".75rem .85rem", borderTop: "1px solid var(--border)", display: "flex", gap: ".5rem" }}>
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleChatSend()}
              placeholder="Ask a question…"
              style={{
                flex: 1,
                background: "var(--input-bg)",
                border: "1px solid var(--input-border)",
                borderRadius: 10,
                padding: ".55rem .85rem",
                fontSize: ".85rem",
                color: "var(--foreground)",
                outline: "none",
              }}
            />
            <button
              onClick={handleChatSend}
              disabled={!chatInput.trim() || chatLoading}
              style={{
                width: 36, height: 36,
                borderRadius: 10,
                background: chatInput.trim() ? "linear-gradient(135deg, #7c3aed, #9333ea)" : "var(--surface-raised)",
                border: "none",
                cursor: chatInput.trim() ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Send size={15} color={chatInput.trim() ? "#fff" : "var(--foreground-faint)"} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 680px) {
          .booking-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
