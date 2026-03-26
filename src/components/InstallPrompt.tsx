"use client";

import { useState, useEffect } from "react";
import { Download, X, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Don't show if already installed as PWA
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const dismissed = localStorage.getItem("bf-pwa-dismissed");
    if (dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setShow(false);
  };

  const handleDismiss = () => {
    localStorage.setItem("bf-pwa-dismissed", "1");
    setShow(false);
  };

  if (!show || installed) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: "5.5rem",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 8000,
      width: "calc(100% - 2rem)",
      maxWidth: 480,
      borderRadius: 16,
      border: "1px solid rgba(124,58,237,.3)",
      background: "var(--card)",
      boxShadow: "0 8px 32px rgba(0,0,0,.35)",
      padding: "1rem 1.25rem",
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      animation: "slideUp .3s ease",
    }}>
      {/* Icon */}
      <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#7c3aed,#9333ea)", display: "grid", placeItems: "center", flexShrink: 0, boxShadow: "0 4px 16px rgba(124,58,237,.4)" }}>
        <Smartphone size={22} color="#fff" />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 700, fontSize: ".88rem", color: "var(--foreground)", margin: 0 }}>
          Install Bestflow
        </p>
        <p style={{ fontSize: ".75rem", color: "var(--foreground-muted)", margin: ".15rem 0 0" }}>
          Add to your home screen for quick access
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: ".5rem", flexShrink: 0 }}>
        <button
          onClick={handleInstall}
          style={{
            display: "inline-flex", alignItems: "center", gap: ".4rem",
            padding: ".45rem 1rem",
            borderRadius: 8,
            background: "linear-gradient(135deg,#7c3aed,#9333ea)",
            border: "none",
            color: "#fff",
            fontSize: ".8rem",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 2px 12px rgba(124,58,237,.4)",
          }}
        >
          <Download size={13} /> Install
        </button>
        <button
          onClick={handleDismiss}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--foreground-faint)", padding: ".35rem", borderRadius: 6, display: "flex", alignItems: "center" }}
          title="Dismiss"
        >
          <X size={16} />
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(16px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}
