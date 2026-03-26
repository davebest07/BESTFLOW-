import Sidebar from "@/components/Sidebar";
import HelpBot from "@/components/HelpBot";
import InstallPrompt from "@/components/InstallPrompt";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--background)",
        color: "var(--foreground)",
        display: "flex",
        flexDirection: "column",
      }}
      className="dashboard-root"
    >
      <Sidebar />
      <main
        style={{
          flex: 1,
          padding: "1.5rem",
          overflowY: "auto",
          maxWidth: "100%",
          width: "100%",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>{children}</div>
      </main>
      <HelpBot />
      <InstallPrompt />
    </div>
  );
}
