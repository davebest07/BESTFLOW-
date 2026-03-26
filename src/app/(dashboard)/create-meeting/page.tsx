"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import MeetingForm from "@/components/MeetingForm";
import { Loader2, Sparkles } from "lucide-react";

export default function CreateMeetingPage() {
  const { user, isLoading } = useKindeBrowserClient();

  if (isLoading) {
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
        <Loader2 size={20} style={{ animation: "spin 1s linear infinite", color: "#7c3aed" }} />
        Loading…
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Header */}
      <div
        className="create-meeting-header-card"
        style={{
          borderRadius: 18,
          background: "linear-gradient(135deg, #001820 0%, #091b2a 60%, #09090b 100%)",
          border: "1px solid rgba(34,211,238,.2)",
          padding: "2rem 2.25rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 220,
            height: 140,
            background: "radial-gradient(circle, rgba(34,211,238,.2) 0%, transparent 70%)",
            filter: "blur(28px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: ".4rem",
            padding: ".25rem .75rem",
            borderRadius: 999,
            background: "rgba(34,211,238,.1)",
            border: "1px solid rgba(34,211,238,.2)",
            fontSize: ".72rem",
            fontWeight: 700,
            letterSpacing: ".08em",
            textTransform: "uppercase" as const,
            color: "#67e8f9",
            marginBottom: ".85rem",
          }}
        >
          <Sparkles size={11} />
          Event Setup
        </div>
        <h1
          style={{
            fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
            fontWeight: 800,
            letterSpacing: "-.04em",
            marginBottom: ".35rem",
          }}
        >
          Create Meeting Event
        </h1>
        <p style={{ fontSize: ".88rem", color: "var(--foreground-muted)" }}>
          Set up a new event type that people can book with you.
        </p>
      </div>

      <MeetingForm
        userId={user?.id ?? ""}
        userName={
          user?.given_name && user?.family_name
            ? `${user.given_name} ${user.family_name}`
            : user?.given_name ?? "Host"
        }
        userEmail={user?.email ?? ""}
      />
    </div>
  );
}
