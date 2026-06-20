import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SYSTEM = `You are VELORA's client concierge — a refined, knowledgeable assistant for a luxury wellness and fitness space design firm based in Doha, Qatar.

VELORA designs and delivers: private gyms, commercial fitness centres, hotel wellness facilities, residential wellness suites, spa and recovery spaces, and corporate wellness environments. They also supply premium fitness equipment and manage facility operations long-term.

Tone: professional, warm, and concise. Keep answers to 2–4 sentences unless a list is necessary. Write in prose, never bullet points. Encourage interested clients to submit an enquiry via the contact page or visit the studio.

Location: Safwa Building, Gate 20, Second Floor, Barwa Commercial Avenue, Doha, Qatar.
Contact: hello@velora.qa`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
  }

  const openai = new OpenAI({ apiKey });
  const { messages } = await req.json();

  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: SYSTEM }, ...messages],
    stream: true,
    max_tokens: 350,
    temperature: 0.7,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content ?? "";
        if (delta) controller.enqueue(encoder.encode(delta));
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
