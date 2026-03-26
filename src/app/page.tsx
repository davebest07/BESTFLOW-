import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Calendar,
  CalendarCheck2,
  Clock,
  Code2,
  ExternalLink,
  Globe,
  Layers,
  Lock,
  RefreshCcw,
  Users,
  Zap,
} from "lucide-react";
import {
  RegisterLink,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { isAuthenticated } = getKindeServerSession();
  if (await isAuthenticated()) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-[#09090b] text-white antialiased">

      {/* ================================================================ */}
      {/*  NAV — sticky, transparent, blends into hero                     */}
      {/* ================================================================ */}
      <header
        style={{
          position: "fixed",
          inset: "0 0 auto 0",
          zIndex: 100,
          background: "linear-gradient(to bottom, rgba(9,9,11,.92) 0%, transparent 100%)",
          backdropFilter: "blur(0px)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 2rem",
            height: 68,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link
            href="#about"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              fontWeight: 700,
              fontSize: "1.1rem",
              letterSpacing: "-0.02em",
              color: "#fff",
            }}
          >
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "rgba(139,92,246,.2)",
                border: "1px solid rgba(139,92,246,.35)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Calendar size={15} color="#c4b5fd" />
            </span>
            Bestflow
          </Link>

          {/* Nav links */}
          <nav
            style={{
              display: "flex",
              gap: "2.2rem",
              fontSize: ".83rem",
              fontWeight: 500,
              color: "rgba(255,255,255,.55)",
            }}
            className="hidden md:flex"
          >
            {["Product", "Features", "Docs", "Pricing"].map((l) => (
              <Link key={l} href="/" className="nav-link">
                {l}
              </Link>
            ))}
          </nav>

          {/* Auth buttons */}
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <LoginLink
              style={{
                padding: "0.45rem 1rem",
                fontSize: ".83rem",
                fontWeight: 500,
                color: "rgba(255,255,255,.6)",
                borderRadius: 8,
                transition: "color .15s",
              }}
            >
              Log in
            </LoginLink>
            <RegisterLink
              style={{
                padding: "0.5rem 1.1rem",
                fontSize: ".83rem",
                fontWeight: 600,
                color: "#fff",
                background: "#7c3aed",
                borderRadius: 8,
                transition: "background .15s",
              }}
            >
              Get started
            </RegisterLink>
          </div>
        </div>
      </header>

      {/* ================================================================ */}
      {/*  HERO — full-width image-style block with gradient overlay       */}
      {/* ================================================================ */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Background — geometric gradient that mimics a rich photography backdrop */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 80% 70% at 50% 0%, #1e1040 0%, #09090b 70%)",
          }}
        />
        {/* Accent blobs */}
        <div
          style={{
            position: "absolute",
            top: "12%",
            left: "8%",
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,58,237,.28) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            right: "6%",
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(34,211,238,.18) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />

        {/* Hero content */}
        <div
          style={{
            position: "relative",
            maxWidth: 760,
            margin: "0 auto",
            padding: "8rem 2rem 6rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: ".5rem",
              padding: ".35rem 1rem",
              borderRadius: 999,
              border: "1px solid rgba(139,92,246,.35)",
              background: "rgba(139,92,246,.1)",
              fontSize: ".78rem",
              fontWeight: 600,
              color: "#c4b5fd",
              marginBottom: "2rem",
              letterSpacing: ".04em",
              textTransform: "uppercase",
            }}
          >
            <Zap size={12} /> Now live — Bestflow 2.0
          </div>

          <h1
            style={{
              fontSize: "clamp(2.6rem, 6vw, 4.4rem)",
              fontWeight: 800,
              lineHeight: 1.06,
              letterSpacing: "-0.04em",
              marginBottom: "1.6rem",
            }}
          >
            Schedule meetings
            <br />
            <span
              style={{
                background:
                  "linear-gradient(135deg, #a78bfa 0%, #e879f9 50%, #67e8f9 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              that actually happen.
            </span>
          </h1>

          <p
            style={{
              fontSize: "1.1rem",
              lineHeight: 1.7,
              color: "rgba(255,255,255,.5)",
              maxWidth: 520,
              margin: "0 auto 2.8rem",
            }}
          >
            Create beautiful event pages, set your availability, and let people
            book instantly. Powered by realtime Firebase sync and Kinde auth.
          </p>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <RegisterLink
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: ".5rem",
                padding: ".8rem 1.9rem",
                background: "linear-gradient(135deg, #7c3aed, #9333ea)",
                color: "#fff",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: ".95rem",
                boxShadow: "0 0 40px rgba(124,58,237,.45)",
                transition: "all .2s",
                letterSpacing: "-.01em",
              }}
            >
              Start for free <ArrowRight size={16} />
            </RegisterLink>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: ".5rem",
                padding: ".8rem 1.9rem",
                border: "1px solid rgba(255,255,255,.14)",
                background: "rgba(255,255,255,.05)",
                color: "rgba(255,255,255,.8)",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: ".95rem",
                transition: "all .2s",
                letterSpacing: "-.01em",
              }}
            >
              See how it works
            </Link>
          </div>

          {/* Scroll indicator */}
          <div
            style={{
              marginTop: "4.5rem",
              color: "rgba(255,255,255,.2)",
              fontSize: ".72rem",
              letterSpacing: ".12em",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: ".5rem",
            }}
          >
            <span
              style={{
                width: 1,
                height: 32,
                background:
                  "linear-gradient(to bottom, transparent, rgba(255,255,255,.2))",
              }}
            />
            Scroll to explore
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  SOCIAL PROOF BAR                                                */}
      {/* ================================================================ */}
      <section
        style={{
          borderTop: "1px solid rgba(255,255,255,.06)",
          borderBottom: "1px solid rgba(255,255,255,.06)",
          background: "rgba(255,255,255,.025)",
          padding: "2rem",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "1rem",
            textAlign: "center",
          }}
        >
          {[
            { val: "500+", label: "Events created" },
            { val: "2,400+", label: "Bookings confirmed" },
            { val: "99.9%", label: "Uptime" },
            { val: "< 2s", label: "Avg page load" },
          ].map((s) => (
            <div key={s.label}>
              <p
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 800,
                  letterSpacing: "-.04em",
                  color: "#fff",
                }}
              >
                {s.val}
              </p>
              <p
                style={{
                  fontSize: ".78rem",
                  color: "rgba(255,255,255,.38)",
                  marginTop: ".2rem",
                }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================ */}
      {/*  IMAGE-GRID SECTION — inspired by the e-commerce tile layout    */}
      {/*  Two large tiles + two small tiles in a editorial grid           */}
      {/* ================================================================ */}
      <section style={{ padding: "7rem 2rem", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <p
            style={{
              fontSize: ".75rem",
              fontWeight: 700,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "#a78bfa",
              marginBottom: ".8rem",
            }}
          >
            Platform capabilities
          </p>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
              fontWeight: 800,
              letterSpacing: "-.04em",
              marginBottom: "1rem",
            }}
          >
            Built for every side of the meeting.
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,.42)",
              maxWidth: 480,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Whether you're hosting or booking, Bestflow makes the experience feel
            polished and effortless.
          </p>
        </div>

        {/* Tile grid — 2 col x 2 row mosaic */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "auto auto",
            gap: "1.25rem",
          }}
          className="feature-mosaic feature-mosaic-grid"
        >
          {/* Tile 1 — large, spans full width on mobile */}
          <div
            className="feature-tile"
            style={{
              gridColumn: "1 / 2",
              borderRadius: 20,
              overflow: "hidden",
              position: "relative",
              minHeight: 320,
              background:
                "linear-gradient(145deg, #1a0533 0%, #0f172a 60%, #09090b 100%)",
              border: "1px solid rgba(139,92,246,.2)",
              padding: "2.4rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 220,
                height: 220,
                background:
                  "radial-gradient(circle, rgba(124,58,237,.3) 0%, transparent 70%)",
                filter: "blur(30px)",
              }}
            />
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: "rgba(124,58,237,.2)",
                border: "1px solid rgba(139,92,246,.3)",
                display: "grid",
                placeItems: "center",
                marginBottom: "1.4rem",
              }}
            >
              <Layers size={22} color="#a78bfa" />
            </div>
            <div>
              <h3
                style={{
                  fontSize: "1.35rem",
                  fontWeight: 700,
                  letterSpacing: "-.03em",
                  marginBottom: ".6rem",
                }}
              >
                Elegant event types
              </h3>
              <p
                style={{
                  color: "rgba(255,255,255,.45)",
                  lineHeight: 1.65,
                  fontSize: ".9rem",
                  marginBottom: "1.6rem",
                }}
              >
                Build polished booking pages with custom durations, locations,
                and branding. Goes live the moment you hit publish.
              </p>
              <Link
                href="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: ".4rem",
                  fontSize: ".82rem",
                  fontWeight: 600,
                  color: "#a78bfa",
                }}
              >
                Learn more <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Tile 2 — realtime */}
          <div
            style={{
              gridColumn: "2 / 3",
              borderRadius: 20,
              position: "relative",
              minHeight: 320,
              background:
                "linear-gradient(145deg, #001820 0%, #091b2a 60%, #09090b 100%)",
              border: "1px solid rgba(34,211,238,.15)",
              padding: "2.4rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: 200,
                height: 200,
                background:
                  "radial-gradient(circle, rgba(34,211,238,.25) 0%, transparent 70%)",
                filter: "blur(30px)",
              }}
            />
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: "rgba(34,211,238,.1)",
                border: "1px solid rgba(34,211,238,.25)",
                display: "grid",
                placeItems: "center",
                marginBottom: "1.4rem",
              }}
            >
              <RefreshCcw size={22} color="#67e8f9" />
            </div>
            <div>
              <h3
                style={{
                  fontSize: "1.35rem",
                  fontWeight: 700,
                  letterSpacing: "-.03em",
                  marginBottom: ".6rem",
                }}
              >
                Realtime sync
              </h3>
              <p
                style={{
                  color: "rgba(255,255,255,.45)",
                  lineHeight: 1.65,
                  fontSize: ".9rem",
                  marginBottom: "1.6rem",
                }}
              >
                Firestore&apos;s onSnapshot keeps bookings, availability, and events
                live across every device the instant something changes.
              </p>
              <Link
                href="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: ".4rem",
                  fontSize: ".82rem",
                  fontWeight: 600,
                  color: "#67e8f9",
                }}
              >
                Learn more <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Tile 3 — small */}
          <div
            style={{
              gridColumn: "1 / 2",
              borderRadius: 20,
              background: "rgba(255,255,255,.03)",
              border: "1px solid rgba(255,255,255,.08)",
              padding: "2rem",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "rgba(16,185,129,.1)",
                border: "1px solid rgba(16,185,129,.2)",
                display: "grid",
                placeItems: "center",
                marginBottom: "1.2rem",
              }}
            >
              <Users size={20} color="#6ee7b7" />
            </div>
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                letterSpacing: "-.025em",
                marginBottom: ".5rem",
              }}
            >
              Role-aware experience
            </h3>
            <p
              style={{
                color: "rgba(255,255,255,.42)",
                fontSize: ".86rem",
                lineHeight: 1.65,
              }}
            >
              Hosts get management tools. Attendees get a frictionless,
              no-account-needed booking flow.
            </p>
          </div>

          {/* Tile 4 — small */}
          <div
            style={{
              gridColumn: "2 / 3",
              borderRadius: 20,
              background: "rgba(255,255,255,.03)",
              border: "1px solid rgba(255,255,255,.08)",
              padding: "2rem",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "rgba(245,158,11,.1)",
                border: "1px solid rgba(245,158,11,.2)",
                display: "grid",
                placeItems: "center",
                marginBottom: "1.2rem",
              }}
            >
              <Lock size={20} color="#fbbf24" />
            </div>
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                letterSpacing: "-.025em",
                marginBottom: ".5rem",
              }}
            >
              Secure by default
            </h3>
            <p
              style={{
                color: "rgba(255,255,255,.42)",
                fontSize: ".86rem",
                lineHeight: 1.65,
              }}
            >
              Kinde-powered auth protects every host route. Public booking pages
              stay open. Zero compromise.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  SPLIT SECTION — text left, mock dashboard right                 */}
      {/* ================================================================ */}
      <section
        style={{
          background: "rgba(255,255,255,.02)",
          borderTop: "1px solid rgba(255,255,255,.06)",
          borderBottom: "1px solid rgba(255,255,255,.06)",
          padding: "7rem 2rem",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "5rem",
            alignItems: "center",
          }}
          className="split-section"
        >
          {/* Left copy */}
          <div>
            <p
              style={{
                fontSize: ".75rem",
                fontWeight: 700,
                letterSpacing: ".14em",
                textTransform: "uppercase",
                color: "#67e8f9",
                marginBottom: "1rem",
              }}
            >
              Your dashboard
            </p>
            <h2
              style={{
                fontSize: "clamp(1.7rem, 3vw, 2.5rem)",
                fontWeight: 800,
                letterSpacing: "-.04em",
                lineHeight: 1.12,
                marginBottom: "1.4rem",
              }}
            >
              Everything you need,
              <br />
              in one clean view.
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,.45)",
                lineHeight: 1.75,
                marginBottom: "2rem",
                fontSize: ".95rem",
              }}
            >
              Create meeting types, manage your weekly availability, and see all
              your upcoming bookings in a single realtime dashboard. No clutter.
              No friction.
            </p>

            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: ".85rem" }}>
              {[
                { icon: CalendarCheck2, text: "See confirmed bookings the moment they land" },
                { icon: Clock, text: "Smart availability blocks — no double-bookings" },
                { icon: Globe, text: "Public link — anyone can book, no signup needed" },
              ].map((item) => (
                <li
                  key={item.text}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: ".85rem",
                    fontSize: ".9rem",
                    color: "rgba(255,255,255,.65)",
                  }}
                >
                  <span
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: "rgba(103,232,249,.1)",
                      border: "1px solid rgba(103,232,249,.2)",
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    <item.icon size={15} color="#67e8f9" />
                  </span>
                  {item.text}
                </li>
              ))}
            </ul>

            <RegisterLink
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: ".5rem",
                marginTop: "2.5rem",
                padding: ".75rem 1.6rem",
                background: "linear-gradient(135deg, #7c3aed, #9333ea)",
                color: "#fff",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: ".9rem",
                boxShadow: "0 0 32px rgba(124,58,237,.35)",
              }}
            >
              Open your dashboard <ArrowRight size={15} />
            </RegisterLink>
          </div>

          {/* Right — mock dashboard widget */}
          <div
            style={{
              borderRadius: 20,
              background: "linear-gradient(145deg, #0f0f1a, #09090b)",
              border: "1px solid rgba(255,255,255,.1)",
              padding: "1.75rem",
              boxShadow: "0 32px 64px rgba(0,0,0,.5)",
            }}
          >
            {/* Window chrome */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: ".5rem",
                marginBottom: "1.5rem",
              }}
            >
              {["#ef4444", "#f59e0b", "#22c55e"].map((c) => (
                <span
                  key={c}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: c,
                    opacity: 0.7,
                  }}
                />
              ))}
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: ".7rem",
                  color: "rgba(255,255,255,.25)",
                  fontFamily: "monospace",
                }}
              >
                bestflow.app/dashboard
              </span>
            </div>

            {/* Mock content */}
            <div style={{ display: "flex", flexDirection: "column", gap: ".85rem" }}>
              {/* Stat row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: ".6rem" }}>
                {[
                  { label: "Events", val: "4", color: "#a78bfa" },
                  { label: "Bookings", val: "14", color: "#67e8f9" },
                  { label: "This week", val: "6", color: "#6ee7b7" },
                ].map((s) => (
                  <div
                    key={s.label}
                    style={{
                      borderRadius: 12,
                      background: "rgba(255,255,255,.04)",
                      border: "1px solid rgba(255,255,255,.07)",
                      padding: ".9rem .8rem",
                      textAlign: "center",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "1.4rem",
                        fontWeight: 800,
                        color: s.color,
                        letterSpacing: "-.04em",
                      }}
                    >
                      {s.val}
                    </p>
                    <p
                      style={{
                        fontSize: ".65rem",
                        color: "rgba(255,255,255,.3)",
                        marginTop: ".2rem",
                      }}
                    >
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Upcoming events */}
              <div
                style={{
                  borderRadius: 12,
                  background: "rgba(255,255,255,.03)",
                  border: "1px solid rgba(255,255,255,.07)",
                  padding: "1rem",
                }}
              >
                <p
                  style={{
                    fontSize: ".65rem",
                    fontWeight: 600,
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,.25)",
                    marginBottom: ".75rem",
                  }}
                >
                  Upcoming bookings
                </p>
                {[
                  { name: "Intro Call", time: "Today, 3:00 PM", color: "#a78bfa" },
                  { name: "Product Demo", time: "Tomorrow, 10:30 AM", color: "#67e8f9" },
                  { name: "Team Sync", time: "Thu, 2:00 PM", color: "#6ee7b7" },
                ].map((b) => (
                  <div
                    key={b.name}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: ".55rem 0",
                      borderBottom: "1px solid rgba(255,255,255,.05)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: b.color,
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: ".82rem", color: "rgba(255,255,255,.7)" }}>
                        {b.name}
                      </span>
                    </div>
                    <span style={{ fontSize: ".75rem", color: "rgba(255,255,255,.3)" }}>
                      {b.time}
                    </span>
                  </div>
                ))}
              </div>

              {/* Availability bar */}
              <div
                style={{
                  borderRadius: 12,
                  background: "rgba(255,255,255,.03)",
                  border: "1px solid rgba(255,255,255,.07)",
                  padding: ".9rem 1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#4ade80",
                    boxShadow: "0 0 6px #4ade80",
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: ".78rem", color: "rgba(255,255,255,.6)", fontWeight: 600 }}>
                    Availability active
                  </p>
                  <p style={{ fontSize: ".68rem", color: "rgba(255,255,255,.3)", marginTop: ".15rem" }}>
                    Mon–Fri, 9 AM – 5 PM
                  </p>
                </div>
                <span
                  style={{
                    fontSize: ".68rem",
                    fontWeight: 600,
                    color: "#4ade80",
                    background: "rgba(74,222,128,.1)",
                    border: "1px solid rgba(74,222,128,.2)",
                    borderRadius: 6,
                    padding: ".25rem .6rem",
                  }}
                >
                  Live
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  HOW IT WORKS — editorial strip                                  */}
      {/* ================================================================ */}
      <section style={{ padding: "7rem 2rem", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <p
            style={{
              fontSize: ".75rem",
              fontWeight: 700,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "#a78bfa",
              marginBottom: ".8rem",
            }}
          >
            How it works
          </p>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
              fontWeight: 800,
              letterSpacing: "-.04em",
            }}
          >
            Setup to first booking in 5 minutes.
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.25rem",
          }}
          className="steps-grid"
        >
          {[
            {
              num: "01",
              title: "Create your event type",
              desc: "Name it, set a duration, pick a location (Zoom, Meet, etc). Publish with one click.",
              color: "#a78bfa",
              border: "rgba(167,139,250,.18)",
              bg: "rgba(167,139,250,.06)",
            },
            {
              num: "02",
              title: "Share your public link",
              desc: "Send the link to anyone. They pick from your real, live availability — no email back and forth.",
              color: "#67e8f9",
              border: "rgba(103,232,249,.18)",
              bg: "rgba(103,232,249,.06)",
            },
            {
              num: "03",
              title: "Manage in realtime",
              desc: "Bookings appear in your dashboard the moment they're confirmed. Cancel or reschedule anytime.",
              color: "#6ee7b7",
              border: "rgba(110,231,183,.18)",
              bg: "rgba(110,231,183,.06)",
            },
          ].map((s) => (
            <div
              key={s.num}
              style={{
                borderRadius: 20,
                border: `1px solid ${s.border}`,
                background: s.bg,
                padding: "2rem",
              }}
            >
              <p
                style={{
                  fontSize: "3rem",
                  fontWeight: 900,
                  letterSpacing: "-.05em",
                  color: s.color,
                  opacity: 0.3,
                  marginBottom: "1.2rem",
                  lineHeight: 1,
                }}
              >
                {s.num}
              </p>
              <h3
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  letterSpacing: "-.025em",
                  marginBottom: ".7rem",
                }}
              >
                {s.title}
              </h3>
              <p
                style={{
                  color: "rgba(255,255,255,.42)",
                  fontSize: ".88rem",
                  lineHeight: 1.7,
                }}
              >
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================ */}
      {/*  ABOUT THE CREATOR                                               */}
      {/* ================================================================ */}
      <section
        id="about"
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          padding: "7rem 2rem",
        }}
      >
        {/* Background photo */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
          }}
        >
          <Image
            src="/david-bg.png"
            alt="David Soboma Bestman"
            fill
            style={{ objectFit: "cover", objectPosition: "center top" }}
            priority={false}
          />
          {/* Dark overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, rgba(9,9,11,.55) 0%, rgba(9,9,11,.75) 50%, rgba(9,9,11,.95) 100%)",
            }}
          />
        </div>

        {/* Content */}
        <div style={{ position: "relative", zIndex: 10, maxWidth: 620, width: "100%", textAlign: "center" }}>

          {/* Avatar */}
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #9333ea)", display: "grid", placeItems: "center", margin: "0 auto 2rem", border: "2px solid rgba(139,92,246,.4)", boxShadow: "0 0 40px rgba(124,58,237,.35)" }}>
            <span style={{ fontSize: "1.75rem", fontWeight: 800, color: "#fff" }}>D</span>
          </div>

          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", padding: ".3rem 1rem", borderRadius: 999, background: "rgba(139,92,246,.15)", border: "1px solid rgba(139,92,246,.35)", fontSize: ".75rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#c4b5fd", marginBottom: "1.5rem" }}>
            <Zap size={11} /> About the Creator
          </div>

          {/* Heading */}
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 800, letterSpacing: "-.045em", lineHeight: 1.1, marginBottom: "1.5rem", color: "#fff" }}>
            Built by{" "}
            <span style={{ background: "linear-gradient(135deg, #a78bfa, #e879f9, #67e8f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              David Soboma Bestman
            </span>
          </h2>

          {/* Bio */}
          <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "rgba(255,255,255,.7)", maxWidth: 560, margin: "0 auto 1.25rem" }}>
            David is an aspiring software engineer and Information Technology student with a passion for building clean, functional, and user focused products. He enjoys turning ideas into real tools that people can actually use, focusing on simplicity, efficiency, and thoughtful design.
          </p>
          <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "rgba(255,255,255,.7)", maxWidth: 560, margin: "0 auto 1.25rem" }}>
            BestFlow was created to solve the frustrating back and forth of scheduling, transforming it into a seamless, modern experience that respects everyone&apos;s time. The goal is simple: remove unnecessary friction and make coordination feel effortless.
          </p>
          <p style={{ fontSize: ".95rem", lineHeight: 1.75, color: "rgba(255,255,255,.45)", maxWidth: 520, margin: "0 auto 2.5rem" }}>
            Driven by curiosity and a constant desire to improve, David is always learning, experimenting, and building solutions that make everyday interactions smoother and more intuitive.
          </p>

          {/* Tech stack pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: ".6rem", justifyContent: "center", marginBottom: "2.5rem" }}>
            {["Next.js", "React", "Firebase", "Kinde Auth", "TailwindCSS", "TypeScript"].map((tech) => (
              <span key={tech} style={{ padding: ".3rem .85rem", borderRadius: 999, background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)", fontSize: ".78rem", fontWeight: 600, color: "rgba(255,255,255,.6)" }}>
                {tech}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2.5rem" }}>
            {[
              { icon: Code2, value: "1", label: "Product shipped" },
              { icon: Zap, value: "100%", label: "Passion driven" },
              { icon: Users, value: "∞", label: "Meetings enabled" },
            ].map((s) => (
              <div key={s.label} style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.05)", backdropFilter: "blur(10px)", padding: "1.25rem 1rem" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(139,92,246,.2)", border: "1px solid rgba(139,92,246,.3)", display: "grid", placeItems: "center", margin: "0 auto .85rem" }}>
                  <s.icon size={16} color="#c4b5fd" />
                </div>
                <p style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-.04em", color: "#fff" }}>{s.value}</p>
                <p style={{ fontSize: ".72rem", color: "rgba(255,255,255,.35)", marginTop: ".2rem" }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: ".85rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="https://github.com/davebest07"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", padding: ".75rem 1.75rem", border: "1px solid rgba(255,255,255,.15)", background: "rgba(255,255,255,.07)", backdropFilter: "blur(10px)", color: "rgba(255,255,255,.7)", borderRadius: 11, fontWeight: 600, fontSize: ".9rem" }}
            >
              <ExternalLink size={16} /> GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/davidbestman/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", padding: ".75rem 1.75rem", border: "1px solid rgba(255,255,255,.15)", background: "rgba(255,255,255,.07)", backdropFilter: "blur(10px)", color: "rgba(255,255,255,.7)", borderRadius: 11, fontWeight: 600, fontSize: ".9rem" }}
            >
              <ExternalLink size={16} /> LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  CTA BANNER                                                      */}
      {/* ================================================================ */}
      <section style={{ padding: "0 2rem 8rem", maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            borderRadius: 24,
            background:
              "linear-gradient(135deg, #1a0533 0%, #0c1a2e 50%, #05070e 100%)",
            border: "1px solid rgba(139,92,246,.22)",
            padding: "5rem 3rem",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(124,58,237,.2) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <h2
            style={{
              fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)",
              fontWeight: 800,
              letterSpacing: "-.04em",
              maxWidth: 560,
              margin: "0 auto 1.2rem",
              lineHeight: 1.12,
            }}
          >
            Stop playing email tag.
            <br />
            Start using Bestflow.
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,.42)",
              maxWidth: 420,
              margin: "0 auto 2.5rem",
              lineHeight: 1.7,
              fontSize: ".95rem",
            }}
          >
            Free forever for individuals. Create your first event in under two
            minutes and share it with the world.
          </p>
          <RegisterLink
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: ".6rem",
              padding: ".85rem 2.2rem",
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              color: "#fff",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: "1rem",
              boxShadow: "0 0 48px rgba(124,58,237,.5)",
              letterSpacing: "-.01em",
            }}
          >
            Get started — it&apos;s free <ArrowRight size={16} />
          </RegisterLink>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  FOOTER                                                          */}
      {/* ================================================================ */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,.07)",
          padding: "2.5rem 2rem",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                background: "rgba(139,92,246,.2)",
                border: "1px solid rgba(139,92,246,.3)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Calendar size={13} color="#c4b5fd" />
            </span>
            <span
              style={{
                fontSize: ".85rem",
                fontWeight: 700,
                color: "rgba(255,255,255,.6)",
              }}
            >
              Bestflow
            </span>
          </div>

          <p
            style={{
              fontSize: ".75rem",
              color: "rgba(255,255,255,.22)",
            }}
          >
            &copy; {new Date().getFullYear()} Bestflow. Built with Next.js,
            Firebase &amp; Kinde.
          </p>

          <div
            style={{
              display: "flex",
              gap: "1.6rem",
              fontSize: ".78rem",
              color: "rgba(255,255,255,.3)",
            }}
          >
            {["Privacy", "Terms", "Contact"].map((l) => (
              <Link key={l} href="/" style={{ transition: "color .15s" }}>
                {l}
              </Link>
            ))}
          </div>
        </div>
      </footer>

      {/* Responsive grid overrides */}
      <style>{`
        @media (max-width: 768px) {
          .feature-mosaic {
            grid-template-columns: 1fr !important;
          }
          .feature-mosaic > div {
            grid-column: 1 / 2 !important;
          }
          .split-section {
            grid-template-columns: 1fr !important;
          }
          .steps-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
