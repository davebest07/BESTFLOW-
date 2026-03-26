import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { db, collection, doc, getDoc, getDocs, setDoc, query, where } from "@/lib/firebase";

// GET /api/profile – get current user's profile (including slug)
export async function GET() {
  const { user, error } = await getAuthUser();
  if (error) return error;

  const snap = await getDoc(doc(db, "userProfiles", user!.id));
  if (!snap.exists()) return NextResponse.json({ slug: "" });
  return NextResponse.json(snap.data());
}

// POST /api/profile – save slug
export async function POST(req: NextRequest) {
  const { user, error } = await getAuthUser();
  if (error) return error;

  const { slug } = await req.json();
  const clean = slug.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 40);
  if (!clean) return NextResponse.json({ error: "Invalid slug" }, { status: 400 });

  // Check uniqueness
  const existing = await getDocs(query(collection(db, "userProfiles"), where("slug", "==", clean)));
  const conflict = existing.docs.find(d => d.id !== user!.id);
  if (conflict) return NextResponse.json({ error: "Slug already taken" }, { status: 409 });

  await setDoc(doc(db, "userProfiles", user!.id), {
    slug: clean,
    userId: user!.id,
    hostName: user!.given_name && user!.family_name ? `${user!.given_name} ${user!.family_name}` : user!.given_name || "Host",
    hostEmail: user!.email || "",
  }, { merge: true });

  return NextResponse.json({ slug: clean });
}
