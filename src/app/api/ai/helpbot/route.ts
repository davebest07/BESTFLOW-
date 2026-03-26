import { NextRequest, NextResponse } from "next/server";
import { Mistral } from "@mistralai/mistralai";

const SYSTEM_PROMPT = `You are Bestflow AI — a friendly, helpful support assistant built into the Bestflow meeting scheduling app.

You help users with:
- How to create meeting events
- How to set availability (days/hours)
- How to share booking links
- How to manage and cancel bookings
- How to use the analytics dashboard
- How to set a custom booking URL slug
- How to use buffer time between meetings
- How to edit or delete meeting events
- How to view booking details
- How to use the AI description generator
- How to change between dark and light mode
- How to update profile/settings
- General troubleshooting

App overview:
- Bestflow is a full-stack meeting scheduler built with Next.js, Firebase, and Kinde Auth
- Dashboard sections: Dashboard (overview), Create Meeting, Availability, Analytics, Settings
- Public booking page: /booking/[eventId] — shareable link for others to book time
- Custom profile page: /book/[slug] — personalized booking profile page

Keep responses short, friendly, and practical (2-4 sentences max). Use bullet points only when listing steps. If you don't know something, say so honestly and suggest checking the settings page.`;

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();
    if (!message) return NextResponse.json({ error: "message required" }, { status: 400 });

    if (!process.env.MISTRAL_API_KEY) {
      return NextResponse.json({ error: "AI not configured" }, { status: 500 });
    }

    const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

    const messages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...(history ?? []),
      { role: "user" as const, content: message },
    ];

    const result = await client.chat.complete({
      model: "mistral-small-latest",
      messages,
      maxTokens: 200,
      temperature: 0.6,
    });

    const reply = result.choices?.[0]?.message?.content?.toString().trim() ?? "I'm not sure about that. Try checking the Settings page or creating a new meeting event.";
    return NextResponse.json({ reply });
  } catch (err: unknown) {
    console.error("[helpbot]", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
