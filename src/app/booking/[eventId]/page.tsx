import { getMeetingEvent } from "@/lib/firestore";
import BookingView from "@/components/BookingView";
import { Calendar } from "lucide-react";
import Link from "next/link";

interface BookingPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { eventId } = await params;
  const raw = await getMeetingEvent(eventId);

  if (!raw) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#09090b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          color: "#fff",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "rgba(255,255,255,.05)",
              border: "1px solid rgba(255,255,255,.1)",
              display: "grid",
              placeItems: "center",
              margin: "0 auto 1.25rem",
            }}
          >
            <Calendar size={28} color="rgba(255,255,255,.3)" />
          </div>
          <h1 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: ".5rem" }}>
            Event not found
          </h1>
          <p style={{ color: "rgba(255,255,255,.38)", fontSize: ".88rem", marginBottom: "1.5rem" }}>
            This meeting event may have been removed or the link is incorrect.
          </p>
          <Link
            href="/"
            style={{
              display: "inline-block",
              padding: ".6rem 1.4rem",
              background: "linear-gradient(135deg, #7c3aed, #9333ea)",
              color: "#fff",
              borderRadius: 10,
              fontWeight: 600,
              fontSize: ".88rem",
            }}
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  // Strip non-serialisable Firestore Timestamp before passing to client component
  const event = {
    id: raw.id,
    title: raw.title,
    description: raw.description ?? "",
    duration: raw.duration,
    locationType: raw.locationType,
    locationDetails: raw.locationDetails ?? "",
    themeColor: raw.themeColor ?? "#7c3aed",
    hostId: raw.hostId,
    hostName: raw.hostName ?? "",
    hostEmail: raw.hostEmail ?? "",
  };

  return <BookingView event={event} />;
}
