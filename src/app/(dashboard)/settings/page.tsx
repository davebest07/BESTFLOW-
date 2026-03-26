"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Loader2, Sparkles, User, Mail, Calendar, ExternalLink, Copy, Check, Link2, BarChart2 } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const { user, isLoading } = useKindeBrowserClient();
  const [copied, setCopied] = useState(false);
  const [slug, setSlug] = useState("");
  const [savedSlug, setSavedSlug] = useState("");
  const [slugSaving, setSlugSaving] = useState(false);
  const [slugMsg, setSlugMsg] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then(r => r.json())
      .then(d => { if (d.slug) { setSlug(d.slug); setSavedSlug(d.slug); } })
      .catch(() => {});
  }, []);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveSlug = async () => {
    setSlugSaving(true);
    setSlugMsg(null);
    try {
      const res = await fetch("/api/profile", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug }) });
      const data = await res.json();
      if (!res.ok) { setSlugMsg({ text: data.error || "Error saving", ok: false }); return; }
      setSavedSlug(data.slug);
      setSlug(data.slug);
      setSlugMsg({ text: "Saved! Your booking page is live.", ok: true });
      setTimeout(() => setSlugMsg(null), 4000);
    } catch {
      setSlugMsg({ text: "Failed to save", ok: false });
    } finally {
      setSlugSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", gap: ".75rem", color: "var(--foreground-muted)" }}>
        <Loader2 size={20} color="#7c3aed" style={{ animation: "spin 1s linear infinite" }} />
        Loading…
      </div>
    );
  }

  const fullName = [user?.given_name, user?.family_name].filter(Boolean).join(" ") || "—";
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const bookingUrl = savedSlug ? `${origin}/book/${savedSlug}` : "";

  const fieldStyle: React.CSSProperties = {
    width: "100%",
    background: "var(--input-bg)",
    border: "1px solid var(--input-border)",
    borderRadius: 12,
    padding: ".75rem 1rem",
    fontSize: ".9rem",
    color: "var(--foreground-muted)",
    outline: "none",
    cursor: "not-allowed",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: ".78rem",
    fontWeight: 700,
    letterSpacing: ".04em",
    textTransform: "uppercase" as const,
    color: "var(--foreground-faint)",
    marginBottom: ".5rem",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Header */}
      <div className="settings-header-card" style={{ borderRadius: 18, background: "linear-gradient(135deg, #0d1f0d 0%, #0b1a1a 60%, #09090b 100%)", border: "1px solid rgba(74,222,128,.15)", padding: "2rem 2.25rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: 220, height: 140, background: "radial-gradient(circle, rgba(74,222,128,.18) 0%, transparent 70%)", filter: "blur(28px)", pointerEvents: "none" }} />
        <div style={{ display: "inline-flex", alignItems: "center", gap: ".4rem", padding: ".25rem .75rem", borderRadius: 999, background: "rgba(74,222,128,.1)", border: "1px solid rgba(74,222,128,.2)", fontSize: ".72rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" as const, color: "#4ade80", marginBottom: ".85rem" }}>
          <Sparkles size={11} /> Settings
        </div>
        <h1 style={{ fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 800, letterSpacing: "-.04em", marginBottom: ".35rem" }}>Account Settings</h1>
        <p style={{ fontSize: ".88rem", color: "var(--foreground-muted)" }}>Manage your profile and booking page URL.</p>
      </div>

      {/* Profile card */}
      <div style={{ borderRadius: 18, border: "1px solid var(--border)", background: "var(--card)", padding: "1.75rem", maxWidth: 620 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "1.75rem" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #9333ea)", display: "grid", placeItems: "center", flexShrink: 0, border: "2px solid rgba(139,92,246,.3)" }}>
            <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff" }}>{user?.given_name?.[0]?.toUpperCase() ?? "?"}</span>
          </div>
          <div>
            <p style={{ fontSize: "1.1rem", fontWeight: 700, letterSpacing: "-.02em", color: "var(--foreground)" }}>{fullName}</p>
            <p style={{ fontSize: ".85rem", color: "var(--foreground-muted)", marginTop: ".2rem" }}>{user?.email}</p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
          <div>
            <label style={labelStyle}>Full Name</label>
            <div style={{ position: "relative" }}>
              <User size={15} color="var(--foreground-faint)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
              <input readOnly value={fullName} style={{ ...fieldStyle, paddingLeft: "2.5rem" }} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <div style={{ position: "relative" }}>
              <Mail size={15} color="var(--foreground-faint)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
              <input readOnly value={user?.email ?? ""} style={{ ...fieldStyle, paddingLeft: "2.5rem" }} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>User ID</label>
            <input readOnly value={user?.id ?? ""} style={fieldStyle} />
          </div>
          <p style={{ fontSize: ".78rem", color: "var(--foreground-faint)", marginTop: ".25rem" }}>
            To update your name or email, visit your{" "}
            <a href="https://app.kinde.com" target="_blank" rel="noopener noreferrer" style={{ color: "#a78bfa", textDecoration: "underline" }}>Kinde account</a>.
          </p>
        </div>
      </div>

      {/* Custom booking URL */}
      <div style={{ borderRadius: 18, border: "1px solid var(--border)", background: "var(--card)", padding: "1.75rem", maxWidth: 620 }}>
        <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "1.25rem" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--primary-light)", border: "1px solid var(--active-border)", display: "grid", placeItems: "center" }}>
            <Link2 size={16} color="var(--icon-color)" />
          </div>
          <div>
            <p style={{ fontSize: ".95rem", fontWeight: 700, color: "var(--foreground)" }}>Your Booking Page URL</p>
            <p style={{ fontSize: ".78rem", color: "var(--foreground-muted)" }}>Share this link — people can see all your meeting types</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: ".75rem", alignItems: "flex-start", marginBottom: ".75rem" }}>
          <div style={{ flex: 1, display: "flex", borderRadius: 12, border: "1px solid var(--input-border)", background: "var(--input-bg)", overflow: "hidden" }}>
            <span style={{ padding: ".75rem 1rem", fontSize: ".88rem", color: "var(--foreground-faint)", borderRight: "1px solid var(--border)", whiteSpace: "nowrap", flexShrink: 0 }}>
              {origin}/book/
            </span>
            <input
              value={slug}
              onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              placeholder="your-name"
              style={{ flex: 1, background: "none", border: "none", outline: "none", padding: ".75rem .75rem", fontSize: ".88rem", color: "var(--foreground)" }}
            />
          </div>
          <button
            onClick={handleSaveSlug}
            disabled={slugSaving || !slug}
            className="btn-glow"
            style={{ padding: ".75rem 1.25rem", background: !slug ? "var(--primary-light)" : "linear-gradient(135deg,#7c3aed,#9333ea)", color: !slug ? "var(--foreground-muted)" : "#fff", borderRadius: 12, fontWeight: 700, fontSize: ".88rem", border: "none", cursor: !slug ? "not-allowed" : "pointer", whiteSpace: "nowrap", flexShrink: 0, boxShadow: !slug ? "none" : "0 0 20px rgba(124,58,237,.35)" }}
          >
            {slugSaving ? <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> : "Save"}
          </button>
        </div>

        {slugMsg && (
          <p style={{ fontSize: ".8rem", color: slugMsg.ok ? "#16a34a" : "var(--danger)", fontWeight: 600 }}>{slugMsg.text}</p>
        )}

        {savedSlug && (
          <div style={{ display: "flex", alignItems: "center", gap: ".6rem", padding: ".65rem 1rem", borderRadius: 10, background: "var(--surface-raised)", border: "1px solid var(--border)", marginTop: ".5rem" }}>
            <span style={{ flex: 1, fontSize: ".82rem", color: "var(--foreground-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{bookingUrl}</span>
            <button onClick={() => handleCopy(bookingUrl)} style={{ display: "inline-flex", alignItems: "center", gap: ".35rem", padding: ".35rem .75rem", borderRadius: 8, background: copied ? "rgba(74,222,128,.12)" : "var(--primary-light)", border: "1px solid", borderColor: copied ? "rgba(74,222,128,.3)" : "var(--active-border)", color: copied ? "#16a34a" : "var(--active-color)", fontWeight: 600, fontSize: ".75rem", cursor: "pointer" }}>
              {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "Copied!" : "Copy"}
            </button>
            <Link href={`/book/${savedSlug}`} target="_blank" style={{ display: "inline-flex", alignItems: "center", gap: ".35rem", padding: ".35rem .75rem", borderRadius: 8, background: "var(--surface-raised)", border: "1px solid var(--border)", color: "var(--foreground-muted)", fontWeight: 600, fontSize: ".75rem" }}>
              <ExternalLink size={12} /> Open
            </Link>
          </div>
        )}
      </div>

      {/* Quick links */}
      <div style={{ borderRadius: 18, border: "1px solid var(--border)", background: "var(--card)", padding: "1.75rem", maxWidth: 620 }}>
        <p style={{ fontSize: ".78rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--foreground-faint)", marginBottom: "1.1rem" }}>Quick Links</p>
        <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
          {[
            { icon: Calendar,    label: "Go to Dashboard",        href: "/dashboard" },
            { icon: ExternalLink, label: "Create a new meeting",  href: "/create-meeting" },
            { icon: ExternalLink, label: "Set your availability", href: "/availability" },
            { icon: BarChart2,   label: "View Analytics",         href: "/analytics" },
          ].map((item) => (
            <Link key={item.label} href={item.href} className="settings-quick-link" style={{ display: "flex", alignItems: "center", gap: ".75rem", padding: ".75rem 1rem", borderRadius: 12, background: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground-muted)", fontSize: ".88rem", fontWeight: 600 }}>
              <item.icon size={15} color="var(--foreground-faint)" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
