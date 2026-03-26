import { NextRequest, NextResponse } from "next/server";
import { db, collection, getDocs, query, where } from "@/lib/firebase";
import { getMeetingEventsByHost } from "@/lib/firestore";

// GET /api/profile/[slug] – public lookup by slug
export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const snap = await getDocs(query(collection(db, "userProfiles"), where("slug", "==", slug.toLowerCase())));
  if (snap.empty) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const profile = snap.docs[0].data();
  const events = await getMeetingEventsByHost(profile.userId);
  return NextResponse.json({ profile, events });
}
