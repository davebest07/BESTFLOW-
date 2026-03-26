"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, LayoutDashboard, Clock, Plus, LogOut, Settings, Sun, Moon, BarChart2 } from "lucide-react";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useTheme } from "@/context/ThemeContext";

const navItems = [
  { href: "/dashboard",   label: "Dashboard",      icon: LayoutDashboard },
  { href: "/create-meeting", label: "Create Meeting", icon: Plus },
  { href: "/availability", label: "Availability",   icon: Clock },
  { href: "/analytics",   label: "Analytics",       icon: BarChart2 },
  { href: "/settings",    label: "Settings",        icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <>
      {/* ── Mobile top bar ── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          borderBottom: "1px solid var(--sidebar-border)",
          background: "var(--nav-bg)",
          backdropFilter: "blur(12px)",
        }}
        className="md:hidden"
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 1.25rem",
            height: 58,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            href="/about"
            style={{
              display: "flex",
              alignItems: "center",
              gap: ".55rem",
              fontWeight: 700,
              fontSize: "1rem",
              color: "var(--header-text)",
            }}
          >
            <span
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: "var(--icon-bg)",
                border: "1px solid var(--icon-border)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Calendar size={14} color="var(--icon-color)" />
            </span>
            Bestflow
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="icon-btn"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              style={{
                display: "grid",
                placeItems: "center",
                width: 34,
                height: 34,
                borderRadius: 8,
                border: "1px solid var(--input-border)",
                background: "var(--input-bg)",
                color: "var(--foreground-muted)",
                cursor: "pointer",
              }}
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            <LogoutLink
              style={{
                display: "grid",
                placeItems: "center",
                width: 34,
                height: 34,
                borderRadius: 8,
                border: "1px solid var(--input-border)",
                color: "var(--foreground-faint)",
                transition: "all .15s",
              }}
            >
              <LogOut size={15} />
            </LogoutLink>
          </div>
        </div>

        {/* Mobile nav pills */}
        <div
          style={{
            padding: ".5rem 1.25rem .75rem",
            display: "flex",
            gap: ".5rem",
            overflowX: "auto",
          }}
        >
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: ".4rem",
                  whiteSpace: "nowrap",
                  padding: ".35rem .9rem",
                  borderRadius: 999,
                  fontSize: ".78rem",
                  fontWeight: 600,
                  transition: "all .15s",
                  background: active ? "var(--active-bg)" : "var(--input-bg)",
                  border: active
                    ? "1px solid var(--active-border)"
                    : "1px solid var(--input-border)",
                  color: active ? "var(--active-color)" : "var(--inactive-color)",
                }}
              >
                <item.icon size={13} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </header>

      {/* ── Desktop sidebar ── */}
      <aside
        style={{
          width: 240,
          minHeight: "100vh",
          borderRight: "1px solid var(--sidebar-border)",
          background: "var(--sidebar-bg)",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
        className="hidden md:flex"
      >
        {/* Logo */}
        <Link
          href="/about"
          style={{
            display: "flex",
            alignItems: "center",
            gap: ".65rem",
            padding: "1.5rem 1.25rem",
            borderBottom: "1px solid var(--sidebar-border)",
            fontWeight: 700,
            fontSize: "1.05rem",
            color: "var(--header-text)",
            letterSpacing: "-.02em",
          }}
        >
          <span
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: "var(--icon-bg)",
              border: "1px solid var(--icon-border)",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            <Calendar size={16} color="var(--icon-color)" />
          </span>
          Bestflow
        </Link>

        {/* Nav */}
        <nav
          style={{
            flex: 1,
            padding: "1rem .75rem",
            display: "flex",
            flexDirection: "column",
            gap: ".25rem",
          }}
        >
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${active ? "sidebar-link-active" : ""}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: ".75rem",
                  padding: ".65rem .9rem",
                  borderRadius: 10,
                  fontSize: ".86rem",
                  fontWeight: 600,
                  background: active ? "var(--active-bg)" : "transparent",
                  border: active
                    ? "1px solid var(--active-border)"
                    : "1px solid transparent",
                  color: active ? "var(--active-color)" : "var(--inactive-color)",
                }}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Theme toggle + Sign out */}
        <div
          style={{
            padding: ".75rem",
            borderTop: "1px solid var(--sidebar-border)",
            display: "flex",
            flexDirection: "column",
            gap: ".35rem",
          }}
        >
          {/* Theme toggle row */}
          <button
            onClick={toggleTheme}
            className="sidebar-link"
            style={{
              display: "flex",
              alignItems: "center",
              gap: ".75rem",
              padding: ".65rem .9rem",
              borderRadius: 10,
              fontSize: ".86rem",
              fontWeight: 600,
              color: "var(--inactive-color)",
              width: "100%",
              background: "transparent",
              border: "1px solid transparent",
              cursor: "pointer",
            }}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            {isDark ? "Light mode" : "Dark mode"}
            {/* Mini toggle pill */}
            <span
              style={{
                marginLeft: "auto",
                width: 36,
                height: 20,
                borderRadius: 999,
                background: isDark ? "rgba(255,255,255,.1)" : "rgba(124,58,237,.2)",
                border: "1px solid var(--input-border)",
                position: "relative",
                flexShrink: 0,
                transition: "background .2s",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 2,
                  left: isDark ? 2 : 16,
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: isDark ? "rgba(255,255,255,.5)" : "var(--primary)",
                  transition: "left .2s, background .2s",
                }}
              />
            </span>
          </button>

          <LogoutLink
            className="logout-btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: ".75rem",
              padding: ".65rem .9rem",
              borderRadius: 10,
              fontSize: ".86rem",
              fontWeight: 600,
              color: "var(--logout-color)",
              width: "100%",
            }}
          >
            <LogOut size={16} />
            Sign out
          </LogoutLink>
        </div>
      </aside>
    </>
  );
}
