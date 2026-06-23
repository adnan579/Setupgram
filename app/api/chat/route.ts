/** @format */

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// Simple in-memory rate limiter — 1 request per 7 seconds per IP
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 7000;

const SYSTEM_INSTRUCTION = `You are Bizzua, the friendly and knowledgeable AI assistant for SetupGram Infotech Solutions — an AI-driven digital agency and strategic consulting firm based in India that serves clients worldwide.

YOUR PERSONALITY:
- Warm, professional, and concise. Never robotic.
- You speak like a helpful business consultant, not a generic chatbot.
- Use short paragraphs. Never write walls of text.
- Use emojis sparingly — only when it adds warmth, not noise.

ABOUT SETUPGRAM:
- Company: SetupGram Infotech Solutions
- Website: setupgram.com
- Email: info@setupgram.com
- Tagline: "Perfect Place For Business Solutions"

SERVICES:
1. App Development — Web, Android, iOS apps built end-to-end.
2. AI Chatbots (Core) — Intelligent chatbot integration for websites/apps.
3. CRM Solutions — Custom CRM systems replacing HubSpot/Salesforce.
4. Digital Marketing — SEO, social media, performance marketing.
5. Advertising — Paid campaigns on Google, Meta, Instagram, LinkedIn, YouTube, Twitter/X.
6. Business Consulting — Strategic roadmaps for digital transformation.

CONTACT FLOW (when user wants to get in touch):
Step 1: Ask for their name.
Step 2: Ask for their email.
Step 3: Ask which service they're interested in (list all 6).
Step 4: Ask about their project/goals.
Step 5: Summarize and direct to [Contact page](/contact).

RULES:
- Never make up pricing — custom quotes only.
- Only discuss the 6 services listed above.
- Keep responses under 120 words unless detail is explicitly requested.
- Use markdown links like [Contact page](/contact) for pages.
- Off-topic questions: redirect to SetupGram business topics.`;

export async function POST(request: Request) {
  try {
    // ── 1. Parse body ────────────────────────────────────────────────────────
    let body: { messages?: { role: string; content: string }[] };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { reply: "Invalid request. Please try again." },
        { status: 400 },
      );
    }

    const messages = body.messages;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { reply: "No messages received. Please try again." },
        { status: 400 },
      );
    }

    // ── 2. API key check ─────────────────────────────────────────────────────
    const apiKey = process.env.GEMINI_API_KEY;
    if (
      !apiKey ||
      apiKey.trim() === "" ||
      apiKey === "your_gemini_api_key_here"
    ) {
      console.error("GEMINI_API_KEY is missing or invalid.");
      return NextResponse.json({
        reply:
          "Bizzua is being configured. Please contact us at info@setupgram.com 😊",
      });
    }

    // ── 3. Per-IP rate limiting ──────────────────────────────────────────────
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const now = Date.now();
    const lastRequest = rateLimitMap.get(ip) ?? 0;

    if (now - lastRequest < RATE_LIMIT_MS) {
      const waitSec = Math.ceil((RATE_LIMIT_MS - (now - lastRequest)) / 1000);
      return NextResponse.json({
        reply: `Please wait ${waitSec} second${waitSec > 1 ? "s" : ""} before sending another message 😊`,
      });
    }
    rateLimitMap.set(ip, now);

    // Clean up old entries — FIX: use Array.from() to avoid ES2015 iterator issue
    if (rateLimitMap.size > 100) {
      const cutoff = now - 60000;
      Array.from(rateLimitMap.keys()).forEach((key) => {
        if ((rateLimitMap.get(key) ?? 0) < cutoff) {
          rateLimitMap.delete(key);
        }
      });
    }

    // ── 4. Build Gemini contents — trim to last 6 turns ─────────────────────
    const trimmedMessages = messages
      .filter((m) => m.content && m.content.trim() !== "")
      .slice(-6);

    const rawContents = trimmedMessages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content.trim() }],
    }));

    // Merge consecutive same-role turns (Gemini strict requirement)
    const contents: { role: string; parts: { text: string }[] }[] = [];
    for (const turn of rawContents) {
      const last = contents[contents.length - 1];
      if (last && last.role === turn.role) {
        last.parts[0].text += "\n" + turn.parts[0].text;
      } else {
        contents.push({
          role: turn.role,
          parts: [{ text: turn.parts[0].text }],
        });
      }
    }

    // Must start with a user turn
    while (contents.length > 0 && contents[0].role !== "user") {
      contents.shift();
    }

    if (contents.length === 0) {
      return NextResponse.json({ reply: "Hi! How can I help you today? 😊" });
    }

    // ── 5. Call Gemini with retry on 429/503 ─────────────────────────────────
    const requestBody = {
      system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 400,
        topP: 0.9,
      },
    };

    let res: Response | null = null;
    let lastStatus = 0;

    for (let attempt = 0; attempt <= 2; attempt++) {
      if (attempt > 0) {
        await new Promise((r) => setTimeout(r, attempt * 2000));
      }

      res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      lastStatus = res.status;
      if (res.ok) break;
      if (res.status !== 429 && res.status !== 503) break;
    }

    // ── 6. Handle errors after retries ───────────────────────────────────────
    if (!res || !res.ok) {
      const errText = res ? await res.text().catch(() => "") : "";
      console.error(
        `Gemini error ${lastStatus} after retries:`,
        errText.slice(0, 300),
      );

      if (lastStatus === 429) {
        return NextResponse.json({
          reply:
            "I'm a bit busy right now! ⏳ Please wait a few seconds and try again, or email us at info@setupgram.com",
        });
      }
      if (lastStatus === 503) {
        return NextResponse.json({
          reply:
            "The AI service is temporarily unavailable. Please try again in a moment, or reach us at info@setupgram.com 🙏",
        });
      }
      return NextResponse.json({
        reply:
          "I'm having trouble connecting. Please email us at info@setupgram.com and we'll get back to you shortly!",
      });
    }

    // ── 7. Parse response ─────────────────────────────────────────────────────
    const data = await res.json();
    const candidate = data?.candidates?.[0];

    if (!candidate) {
      console.error(
        "No candidates in Gemini response:",
        JSON.stringify(data).slice(0, 300),
      );
      return NextResponse.json({
        reply:
          "I couldn't generate a response. Please try rephrasing, or email us at info@setupgram.com!",
      });
    }

    if (candidate.finishReason === "SAFETY") {
      return NextResponse.json({
        reply:
          "I can't help with that topic, but happy to answer questions about SetupGram's services! 😊",
      });
    }

    const reply =
      candidate?.content?.parts?.[0]?.text?.trim() ||
      "Sorry, I didn't catch that. Could you rephrase? Or email us at info@setupgram.com!";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat route exception:", error);
    return NextResponse.json({
      reply:
        "Something went wrong on my end! Please contact us at info@setupgram.com 🙏",
    });
  }
}
