import { NextRequest, NextResponse } from "next/server";
import { Mistral } from "@mistralai/mistralai";

export async function POST(req: NextRequest) {
  try {
    const { message, eventTitle, eventDescription, duration, locationType, hostName } = await req.json();
    if (!message) return NextResponse.json({ error: "message required" }, { status: 400 });

    const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY! });
    const location = (locationType as string)?.replace(/-/g, " ") ?? "online";

    const systemPrompt = `You are a helpful scheduling assistant for Bestflow embedded on a booking page.
Meeting details:
- Title: "${eventTitle}"
- Host: ${hostName}
- Duration: ${duration} minutes
- Location: ${location}
${eventDescription ? `- Description: "${eventDescription}"` : ""}

Answer questions about this meeting concisely and helpfully. Keep responses short (1-3 sentences).`;

    const result = await client.chat.complete({
      model: "mistral-small-latest",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      maxTokens: 150,
      temperature: 0.7,
    });

    const reply = result.choices?.[0]?.message?.content?.toString().trim() ?? "I'm not sure about that. Feel free to ask anything about this meeting!";
    return NextResponse.json({ reply });
  } catch (err: unknown) {
    console.error("[AI chat]", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
