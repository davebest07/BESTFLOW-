import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { getBookingsByHost } from "@/lib/firestore";
import { Mistral } from "@mistralai/mistralai";
import { getDay, parseISO } from "date-fns";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export async function GET(req: NextRequest) {
  void req;
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const bookings = await getBookingsByHost(user!.id);
    const confirmed = bookings.filter((b) => b.status === "confirmed");

    if (confirmed.length < 3) {
      return NextResponse.json({ suggestion: "You don't have enough booking history yet. Book a few meetings and come back for AI-powered suggestions!" });
    }

    const byday = DAYS.map((name, i) => ({
      name,
      count: confirmed.filter((b) => getDay(parseISO(b.date)) === i).length,
    }));

    const byHour: Record<number, number> = {};
    for (const b of confirmed) {
      const h = parseInt(b.time.split(":")[0]);
      byHour[h] = (byHour[h] ?? 0) + 1;
    }
    const topHours = Object.entries(byHour)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([h]) => {
        const hour = parseInt(h);
        return hour === 0 ? "12am" : hour < 12 ? `${hour}am` : hour === 12 ? "12pm" : `${hour - 12}pm`;
      });

    const avgDuration = Math.round(confirmed.reduce((s, b) => s + b.duration, 0) / confirmed.length);

    const statsText = `
- Total confirmed bookings: ${confirmed.length}
- Bookings by day: ${byday.map((d) => `${d.name}: ${d.count}`).join(", ")}
- Most popular booking hours: ${topHours.join(", ")}
- Average meeting duration: ${avgDuration} minutes`.trim();

    const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY! });

    const result = await client.chat.complete({
      model: "mistral-small-latest",
      messages: [
        {
          role: "system",
          content: "You are a smart scheduling advisor for Bestflow. Based on a user's booking stats, give 2-3 concise, actionable suggestions to optimize their availability settings. Be friendly and specific. Use bullet points (•). Max 80 words total.",
        },
        {
          role: "user",
          content: `Here are my booking stats:\n${statsText}\n\nWhat availability changes would you recommend?`,
        },
      ],
      maxTokens: 180,
      temperature: 0.7,
    });

    const suggestion = result.choices?.[0]?.message?.content?.toString().trim() ?? "";
    return NextResponse.json({ suggestion, stats: { byday, topHours, avgDuration, total: confirmed.length } });
  } catch (err: unknown) {
    console.error("[AI suggest-availability]", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
