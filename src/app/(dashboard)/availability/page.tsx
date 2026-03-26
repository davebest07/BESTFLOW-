"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import AvailabilityForm from "@/components/AvailabilityForm";
import { Loader2, Sparkles } from "lucide-react";

export default function AvailabilityPage() {
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
        className="availability-header-card"
        style={{
          borderRadius: 18,
          background: "linear-gradient(135deg, #0d1f0d 0%, #0b1a1a 60%, #09090b 100%)",
          border: "1px solid rgba(74,222,128,.15)",
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
            background: "radial-gradient(circle, rgba(74,222,128,.18) 0%, transparent 70%)",
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
            background: "rgba(74,222,128,.1)",
            border: "1px solid rgba(74,222,128,.2)",
            fontSize: ".72rem",
            fontWeight: 700,
            letterSpacing: ".08em",
            textTransform: "uppercase" as const,
            color: "#4ade80",
            marginBottom: ".85rem",
          }}
        >
          <Sparkles size={11} />
          Availability
        </div>
        <h1
          style={{
            fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
            fontWeight: 800,
            letterSpacing: "-.04em",
            marginBottom: ".35rem",
          }}
        >
          Set Your Availability
        </h1>
        <p style={{ fontSize: ".88rem", color: "var(--foreground-muted)" }}>
          Define the hours you&apos;re available each day. Attendees will only
          be able to book during these windows.
        </p>
      </div>

      <AvailabilityForm userId={user?.id ?? ""} />
    </div>
  );
}
