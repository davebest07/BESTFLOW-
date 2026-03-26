import { NextRequest, NextResponse } from "next/server";
import { Mistral } from "@mistralai/mistralai";

export async function POST(req: NextRequest) {
  try {
    const { title, duration, locationType } = await req.json();
    if (!title) return NextResponse.json({ error: "title required" }, { status: 400 });

    const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY! });
    const location = (locationType as string)?.replace(/-/g, " ") ?? "online";

    const result = await client.chat.complete({
      model: "mistral-small-latest",
      messages: [
        {
          role: "system",
          content: "You write short, professional, friendly meeting descriptions for a scheduling app called Bestflow. Be concise (2-3 sentences max). No fluff, no bullet points. Natural and confident tone.",
        },
        {
          role: "user",
          content: `Write a description for a meeting called "${title}". Duration: ${duration} minutes. Location type: ${location}.`,
        },
      ],
      maxTokens: 120,
      temperature: 0.75,
    });

    const text = result.choices?.[0]?.message?.content?.toString().trim() ?? "";
    return NextResponse.json({ description: text });
  } catch (err: unknown) {
    console.error("[AI generate-description]", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
