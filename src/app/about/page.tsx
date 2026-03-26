import Link from "next/link";
import { Calendar, ArrowLeft, Code2, Zap, Users, ExternalLink } from "lucide-react";

export default function AboutPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--background)",
        color: "var(--foreground)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Full-page blurred photo background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          backgroundImage: "url('/david-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          pointerEvents: "none",
        }}
      />

      {/* Nav */}
      <header style={{
        position: "relative",
        zIndex: 20,
        padding: "1.5rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid var(--border)",
        background: "var(--nav-bg)",
        backdropFilter: "blur(12px)",
      }}>
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: ".6rem", fontWeight: 700, fontSize: "1.05rem", color: "var(--header-text)", letterSpacing: "-.02em" }}
        >
          <span style={{ width: 32, height: 32, borderRadius: 8, background: "var(--icon-bg)", border: "1px solid var(--icon-border)", display: "grid", placeItems: "center" }}>
            <Calendar size={15} color="var(--icon-color)" />
          </span>
          Bestflow
        </Link>

        <Link
          href="/"
          className="btn-glass"
          style={{ display: "inline-flex", alignItems: "center", gap: ".45rem", padding: ".45rem 1rem", borderRadius: 8, border: "1px solid var(--border)", background: "var(--input-bg)", color: "var(--foreground-muted)", fontSize: ".82rem", fontWeight: 600 }}
        >
          <ArrowLeft size={13} /> Back
        </Link>
      </header>

      {/* Main content */}
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem 2rem", position: "relative", zIndex: 10 }}>
        <div style={{ maxWidth: 620, width: "100%", textAlign: "center" }}>

          {/* Avatar initials */}
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #9333ea)", display: "grid", placeItems: "center", margin: "0 auto 2rem", border: "2px solid rgba(139,92,246,.4)", boxShadow: "0 0 40px rgba(124,58,237,.35)" }}>
            <span style={{ fontSize: "1.75rem", fontWeight: 800, color: "#fff" }}>D</span>
          </div>

          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", padding: ".3rem 1rem", borderRadius: 999, background: "var(--primary-light)", border: "1px solid var(--active-border)", fontSize: ".75rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--active-color)", marginBottom: "1.5rem" }}>
            <Zap size={11} /> About the Creator
          </div>

          {/* Heading */}
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 800, letterSpacing: "-.045em", lineHeight: 1.1, marginBottom: "1.5rem", color: "var(--foreground)" }}>
            Built by{" "}
            <span style={{ background: "linear-gradient(135deg, #a78bfa, #e879f9, #67e8f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              David Soboma Bestman
            </span>
          </h1>

          {/* Bio */}
          <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "var(--foreground-muted)", maxWidth: 520, margin: "0 auto 1.25rem" }}>
            David is a software engineer with a passion for building clean, functional products. Bestflow was created to solve the frustrating back-and-forth of scheduling — turning it into a seamless, modern experience that respects everyone&apos;s time.
          </p>
          <p style={{ fontSize: ".95rem", lineHeight: 1.75, color: "var(--foreground-faint)", maxWidth: 480, margin: "0 auto 3rem" }}>
            Built with Next.js, Firebase, Kinde Auth, and TailwindCSS — every detail designed with intention.
          </p>

          {/* Tech stack pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: ".6rem", justifyContent: "center", marginBottom: "3rem" }}>
            {["Next.js", "React", "Firebase", "Kinde Auth", "TailwindCSS", "TypeScript"].map((tech) => (
              <span
                key={tech}
                style={{ padding: ".3rem .85rem", borderRadius: 999, background: "var(--surface-raised)", border: "1px solid var(--border)", fontSize: ".78rem", fontWeight: 600, color: "var(--foreground-muted)" }}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "3rem" }}>
            {[
              { icon: Code2, value: "1", label: "Product shipped" },
              { icon: Zap, value: "100%", label: "Passion driven" },
              { icon: Users, value: "∞", label: "Meetings enabled" },
            ].map((s) => (
              <div key={s.label} className="stat-card" style={{ borderRadius: 16, border: "1px solid var(--border)", background: "var(--card)", padding: "1.25rem 1rem" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--primary-light)", border: "1px solid var(--active-border)", display: "grid", placeItems: "center", margin: "0 auto .85rem" }}>
                  <s.icon size={16} color="var(--icon-color)" />
                </div>
                <p style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-.04em", color: "var(--foreground)" }}>{s.value}</p>
                <p style={{ fontSize: ".72rem", color: "var(--foreground-faint)", marginTop: ".2rem" }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: ".85rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/dashboard"
              className="new-event-btn"
              style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", padding: ".75rem 1.75rem", background: "linear-gradient(135deg, #7c3aed, #9333ea)", color: "#fff", borderRadius: 11, fontWeight: 700, fontSize: ".9rem", boxShadow: "0 0 32px rgba(124,58,237,.4)" }}
            >
              Open Bestflow
            </Link>
            <a
              href="https://github.com/davebest07"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glass"
              style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", padding: ".75rem 1.75rem", border: "1px solid var(--border)", background: "var(--input-bg)", color: "var(--foreground-muted)", borderRadius: 11, fontWeight: 600, fontSize: ".9rem" }}
            >
              <ExternalLink size={16} /> GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/davidbestman/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glass"
              style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", padding: ".75rem 1.75rem", border: "1px solid var(--border)", background: "var(--input-bg)", color: "var(--foreground-muted)", borderRadius: 11, fontWeight: 600, fontSize: ".9rem" }}
            >
              <ExternalLink size={16} /> LinkedIn
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ position: "relative", zIndex: 10, borderTop: "1px solid var(--border)", padding: "1.25rem 2rem", textAlign: "center", fontSize: ".75rem", color: "var(--foreground-faint)" }}>
        &copy; {new Date().getFullYear()} Bestflow · David Soboma Bestman
      </footer>
    </div>
  );
}
