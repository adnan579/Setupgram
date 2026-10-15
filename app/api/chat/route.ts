/** @format */

import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "../../../lib/rateLimit";

export const dynamic = "force-dynamic";

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// ── Abuse / cost limits (Gemini bills per token) ─────────────────────────────
const MAX_BODY_BYTES = 16_000; // whole request body
const MAX_MESSAGES = 20; // items accepted in `messages` (the widget sends at most 6)
const CONTEXT_TURNS = 6; // turns actually forwarded to Gemini
const MAX_USER_CHARS = 1000; // one user message
const MAX_ASSISTANT_CHARS = 2000; // an earlier bot reply echoed back as context

// Database-backed limits (shared by every serverless instance, see lib/rateLimit.ts)
const LIMIT_PER_IP_SHORT = { max: 20, windowMs: 10 * 60 * 1000 }; // 20 messages / 10 min
const LIMIT_PER_IP_DAY = { max: 100, windowMs: 24 * 60 * 60 * 1000 }; // 100 messages / day
const LIMIT_GLOBAL_DAY = { max: 3000, windowMs: 24 * 60 * 60 * 1000 }; // whole site: circuit breaker

// Used ONLY if the database is unreachable: per-instance, 1 request per 7 seconds per IP.
// Better than failing open with no limit at all.
const fallbackLimitMap = new Map<string, number>();
const FALLBACK_LIMIT_MS = 7000;

type ChatTurn = { role: "user" | "assistant"; content: string };

/** Keeps only well-formed { role, content } turns; anything else is dropped instead of crashing. */
function sanitizeTurns(raw: unknown[]): ChatTurn[] {
  const turns: ChatTurn[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const { role, content } = item as { role?: unknown; content?: unknown };
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") continue;
    const text = content.trim();
    if (text) turns.push({ role, content: text });
  }
  return turns;
}

function fallbackRateLimited(ip: string): number {
  const now = Date.now();
  const last = fallbackLimitMap.get(ip) ?? 0;
  if (now - last < FALLBACK_LIMIT_MS) {
    return Math.ceil((FALLBACK_LIMIT_MS - (now - last)) / 1000);
  }
  fallbackLimitMap.set(ip, now);
  if (fallbackLimitMap.size > 100) {
    const cutoff = now - 60000;
    Array.from(fallbackLimitMap.keys()).forEach((key) => {
      if ((fallbackLimitMap.get(key) ?? 0) < cutoff) fallbackLimitMap.delete(key);
    });
  }
  return 0;
}

const tooManyRequests = (reply: string, retryAfterSeconds: number) =>
  NextResponse.json(
    { reply },
    { status: 429, headers: { "Retry-After": String(Math.max(1, retryAfterSeconds)) } },
  );

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
    // ── 1. Parse and validate body ───────────────────────────────────────────
    // Reject oversized bodies before parsing them.
    const declaredLength = Number(request.headers.get("content-length") ?? 0);
    if (declaredLength > MAX_BODY_BYTES) {
      return NextResponse.json(
        { reply: "That message is too large. Please send something shorter." },
        { status: 413 },
      );
    }

    let rawText: string;
    try {
      rawText = await request.text();
    } catch {
      return NextResponse.json({ reply: "Invalid request. Please try again." }, { status: 400 });
    }
    if (rawText.length > MAX_BODY_BYTES) {
      return NextResponse.json(
        { reply: "That message is too large. Please send something shorter." },
        { status: 413 },
      );
    }

    let body: { messages?: unknown };
    try {
      body = JSON.parse(rawText);
    } catch {
      return NextResponse.json({ reply: "Invalid request. Please try again." }, { status: 400 });
    }

    const rawMessages = body && typeof body === "object" ? body.messages : undefined;
    if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
      return NextResponse.json(
        { reply: "No messages received. Please try again." },
        { status: 400 },
      );
    }
    if (rawMessages.length > MAX_MESSAGES) {
      return NextResponse.json(
        { reply: "Too many messages in one request. Please start a new chat." },
        { status: 400 },
      );
    }

    // Non-string / malformed entries are dropped here instead of crashing later.
    const turns = sanitizeTurns(rawMessages);
    const lastTurn = turns[turns.length - 1];
    if (!lastTurn || lastTurn.role !== "user") {
      return NextResponse.json(
        { reply: "No message received. Please type your question and try again." },
        { status: 400 },
      );
    }
    if (lastTurn.content.length > MAX_USER_CHARS) {
      return NextResponse.json(
        {
          reply: `That message is too long — please keep it under ${MAX_USER_CHARS} characters.`,
        },
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

    // ── 3. Rate limiting (database-backed, shared across all instances) ──────
    const ip = getClientIp(request);
    try {
      const short = await checkRateLimit(
        `chat:${ip}`,
        LIMIT_PER_IP_SHORT.max,
        LIMIT_PER_IP_SHORT.windowMs,
      );
      if (!short.allowed) {
        return tooManyRequests(
          "You're sending messages very quickly! 😊 Please wait a few minutes, or email us at info@setupgram.com",
          short.retryAfterSeconds,
        );
      }
      const day = await checkRateLimit(
        `chat-day:${ip}`,
        LIMIT_PER_IP_DAY.max,
        LIMIT_PER_IP_DAY.windowMs,
      );
      if (!day.allowed) {
        return tooManyRequests(
          "You've reached today's chat limit. Please email us at info@setupgram.com and we'll help you directly!",
          day.retryAfterSeconds,
        );
      }
      const global = await checkRateLimit(
        "chat-global",
        LIMIT_GLOBAL_DAY.max,
        LIMIT_GLOBAL_DAY.windowMs,
      );
      if (!global.allowed) {
        console.error("Bizzua global daily message cap reached — Gemini calls paused.");
        return tooManyRequests(
          "Bizzua is taking a break for today. Please email us at info@setupgram.com and we'll reply soon! 🙏",
          global.retryAfterSeconds,
        );
      }
    } catch (error) {
      // Database unreachable: fall back to a per-instance limit rather than no limit.
      console.error("Chat rate limiter unavailable, using in-memory fallback:", error);
      const wait = fallbackRateLimited(ip);
      if (wait > 0) {
        return tooManyRequests(
          `Please wait ${wait} second${wait > 1 ? "s" : ""} before sending another message 😊`,
          wait,
        );
      }
    }

    // ── 4. Build Gemini contents — last few turns, each length-capped ────────
    const rawContents = turns.slice(-CONTEXT_TURNS).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [
        {
          text: m.content.slice(0, m.role === "assistant" ? MAX_ASSISTANT_CHARS : MAX_USER_CHARS),
        },
      ],
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

      res = await fetch(GEMINI_API_URL, {
        method: "POST",
        // Key goes in a header so it can never end up in logged URLs
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(12_000),
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
