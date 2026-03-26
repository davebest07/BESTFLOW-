"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, Minimize2, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "ai";
  text: string;
}

const SUGGESTED = [
  "How do I create a meeting?",
  "How do I share my booking link?",
  "How do I set my availability?",
  "How do I change my custom URL?",
];

export default function HelpBot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Hi! I'm **Bestflow AI** 👋 Ask me anything about using the app — creating meetings, sharing links, setting availability, or anything else." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasNewMsg, setHasNewMsg] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 100);
      setHasNewMsg(false);
    }
  }, [open, messages]);

  const sendMessage = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: msg }]);
    setLoading(true);

    try {
      const history = messages
        .filter(m => m.role !== "ai" || messages.indexOf(m) !== 0)
        .map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text }));

      const res = await fetch("/api/ai/helpbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, history }),
      });
      const data = await res.json();
      const reply = data.reply ?? "Sorry, I couldn't get a response. Please try again.";
      setMessages(prev => [...prev, { role: "ai", text: reply }]);
      if (!open) setHasNewMsg(true);
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "Network error. Please check your connection and try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const renderText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br/>");
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => { setOpen(o => !o); setMinimized(false); }}
        title="Bestflow AI Help"
        style={{
          position: "fixed",
          bottom: "1.75rem",
          right: "1.75rem",
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #7c3aed, #9333ea)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 24px rgba(124,58,237,.55)",
          zIndex: 9000,
          transition: "transform .2s, box-shadow .2s",
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
      >
        {open ? <X size={20} color="#fff" /> : <MessageCircle size={20} color="#fff" />}
        {hasNewMsg && !open && (
          <span style={{
            position: "absolute", top: 2, right: 2,
            width: 12, height: 12, borderRadius: "50%",
            background: "#4ade80", border: "2px solid var(--background)",
          }} />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: "fixed",
          bottom: "5.25rem",
          right: "1.75rem",
          width: 360,
          borderRadius: 20,
          border: "1px solid rgba(124,58,237,.25)",
          background: "var(--card)",
          boxShadow: "0 12px 48px rgba(0,0,0,.4)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          zIndex: 8999,
          maxHeight: minimized ? "auto" : 500,
          transition: "max-height .3s ease",
        }}>

          {/* Header */}
          <div style={{
            padding: ".85rem 1.1rem",
            background: "linear-gradient(135deg, #6d28d9, #7c3aed)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,.15)", display: "grid", placeItems: "center" }}>
                <Bot size={17} color="#fff" />
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: ".88rem", color: "#fff", margin: 0, display: "flex", alignItems: "center", gap: ".35rem" }}>
                  Bestflow AI <Sparkles size={11} color="#e9d5ff" />
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: ".35rem" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80" }} />
                  <p style={{ fontSize: ".7rem", color: "rgba(255,255,255,.7)", margin: 0 }}>Online — here to help</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setMinimized(m => !m)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,.7)", padding: ".25rem", borderRadius: 6, display: "flex", alignItems: "center" }}
              title={minimized ? "Expand" : "Minimize"}
            >
              <Minimize2 size={15} />
            </button>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div style={{ flex: 1, overflowY: "auto", padding: ".85rem 1rem", display: "flex", flexDirection: "column", gap: ".65rem", minHeight: 280, maxHeight: 340 }}>
                {messages.map((msg, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", gap: ".5rem", alignItems: "flex-end" }}>
                    {msg.role === "ai" && (
                      <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#9333ea)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                        <Bot size={13} color="#fff" />
                      </div>
                    )}
                    <div
                      style={{
                        maxWidth: "78%",
                        padding: ".55rem .9rem",
                        borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                        background: msg.role === "user" ? "linear-gradient(135deg,#7c3aed,#9333ea)" : "var(--surface-raised)",
                        border: msg.role === "user" ? "none" : "1px solid var(--border)",
                        color: msg.role === "user" ? "#fff" : "var(--foreground)",
                        fontSize: ".83rem",
                        lineHeight: 1.6,
                      }}
                      dangerouslySetInnerHTML={{ __html: renderText(msg.text) }}
                    />
                  </div>
                ))}

                {loading && (
                  <div style={{ display: "flex", alignItems: "flex-end", gap: ".5rem" }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#9333ea)", display: "grid", placeItems: "center" }}>
                      <Bot size={13} color="#fff" />
                    </div>
                    <div style={{ padding: ".6rem .9rem", borderRadius: "16px 16px 16px 4px", background: "var(--surface-raised)", border: "1px solid var(--border)", display: "flex", gap: ".3rem", alignItems: "center" }}>
                      {[0, 0.3, 0.6].map((delay, i) => (
                        <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed", display: "block", animation: `pulse 1.2s ease-in-out ${delay}s infinite` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Suggested questions (only show at start) */}
              {messages.length <= 1 && (
                <div style={{ padding: "0 .85rem .75rem", display: "flex", flexWrap: "wrap", gap: ".4rem" }}>
                  {SUGGESTED.map(q => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      style={{
                        padding: ".3rem .75rem",
                        borderRadius: 999,
                        fontSize: ".72rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        background: "rgba(124,58,237,.1)",
                        border: "1px solid rgba(124,58,237,.25)",
                        color: "#a78bfa",
                        transition: "all .15s",
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div style={{ padding: ".75rem .85rem", borderTop: "1px solid var(--border)", display: "flex", gap: ".5rem", flexShrink: 0 }}>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder="Ask anything about Bestflow…"
                  style={{
                    flex: 1,
                    background: "var(--input-bg)",
                    border: "1px solid var(--input-border)",
                    borderRadius: 10,
                    padding: ".55rem .85rem",
                    fontSize: ".83rem",
                    color: "var(--foreground)",
                    outline: "none",
                  }}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: input.trim() && !loading ? "linear-gradient(135deg,#7c3aed,#9333ea)" : "var(--surface-raised)",
                    border: "none",
                    cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all .15s",
                    boxShadow: input.trim() && !loading ? "0 2px 12px rgba(124,58,237,.4)" : "none",
                  }}
                >
                  <Send size={14} color={input.trim() && !loading ? "#fff" : "var(--foreground-faint)"} />
                </button>
              </div>

              {/* Footer */}
              <div style={{ padding: ".4rem", textAlign: "center", borderTop: "1px solid var(--border)" }}>
                <p style={{ fontSize: ".65rem", color: "var(--foreground-faint)", margin: 0 }}>
                  Powered by <strong style={{ color: "#a78bfa" }}>Bestflow AI</strong> · Mistral
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
