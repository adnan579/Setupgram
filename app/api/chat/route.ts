/** @format */

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// gemini-2.5-flash — the current FREE TIER model (as of June 2026)
// gemini-2.0-flash, 1.5-flash, 1.5-pro are ALL SHUT DOWN (404)
// gemini-3.5-flash does NOT exist yet
const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

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
- SetupGram helps businesses grow online through technology and strategy.

SERVICES (know these perfectly):
1. App Development — Web, Android, and iOS apps built end-to-end. Fast, scalable, tailored to the client's business.
2. AI Chatbots (Core Service) — Intelligent AI chatbot integration for websites and apps to automate support and scale sales.
3. CRM Solutions — Custom CRM systems built exactly for the client's workflow, replacing clunky tools like HubSpot/Salesforce.
4. Digital Marketing — SEO, social media campaigns, and performance marketing with measurable ROI.
5. Advertising — High-end paid ad campaigns across Google Ads, Meta, Instagram, LinkedIn, YouTube, Twitter/X. Full-funnel strategy.
6. Business Consulting — Strategic roadmaps and digital transformation plans for businesses going online.

WEBSITE PAGES:
- / (Home) — Hero, Services, Consulting, Testimonials
- /about — Mission, Team, Values, Blog
- /contact — Contact form
- /blog/[slug] — Blog articles

YOUR CAPABILITIES:
1. Answer questions about SetupGram's services, pricing approach, team, and capabilities.
2. Navigate users — tell them which page to visit for what they need.
3. Qualify leads — guide interested users toward /contact.
4. Run the contact intake step-by-step when user wants to get in touch.
5. Explain services in detail when asked.
6. Handle objections about cost, timeline, or fit professionally.

CONTACT FORM FLOW (use this exact sequence when user wants to get in touch):
Step 1: "Great! First, what's your name?"
Step 2: "Nice to meet you, [name]! What's your email address?"
Step 3: "Which service are you most interested in?" (list the 6 services)
Step 4: "Tell me a bit about your project or what you're trying to achieve."
Step 5: Summarize all details and say they can submit at [Contact page](/contact) or the team will reach out within 24 hours.

RULES:
- NEVER make up pricing. Say pricing depends on scope and the team gives custom quotes.
- NEVER claim services outside the 6 listed above.
- Off-topic questions: politely redirect to SetupGram business topics.
- Keep responses under 120 words unless detailed explanation is explicitly requested.
- When referencing a page, use markdown links like [Contact page](/contact).`;

export async function POST(request: Request) {
  try {
    // ── 1. Parse body ──────────────────────────────────────────────────────
    let body: { messages?: { role: string; content: string }[] };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { reply: "Invalid request. Please try again." },
        { status: 400 },
      );
    }

    // Bizzua.tsx sends: { messages: [{ role, content }, ...] }
    const messages = body.messages;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { reply: "No messages received. Please try again." },
        { status: 400 },
      );
    }

    // ── 2. API key check ───────────────────────────────────────────────────
    const apiKey = process.env.GEMINI_API_KEY;
    if (
      !apiKey ||
      apiKey.trim() === "" ||
      apiKey === "your_gemini_api_key_here"
    ) {
      console.error("GEMINI_API_KEY is missing or invalid.");
      return NextResponse.json({
        reply:
          "Bizzua is currently being configured. Please contact us directly at info@setupgram.com — we'd love to hear from you! 😊",
      });
    }

    // ── 3. Build Gemini contents array ─────────────────────────────────────
    // Gemini requires strictly alternating user/model turns starting with user.
    // Filter out empty messages and the welcome assistant message first.
    const rawContents = messages
      .filter((m) => m.content && m.content.trim() !== "")
      .map((m) => ({
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

    // Must start with a user turn — if first turn is "model", remove it
    while (contents.length > 0 && contents[0].role !== "user") {
      contents.shift();
    }

    if (contents.length === 0) {
      return NextResponse.json({
        reply: "Hi! How can I help you today? 😊",
      });
    }

    // ── 4. Call Gemini API ─────────────────────────────────────────────────
    const requestBody = {
      system_instruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }],
      },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
        topP: 0.9,
      },
    };

    const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    // ── 5. Handle errors ───────────────────────────────────────────────────
    if (!res.ok) {
      const errText = await res.text();
      console.error(
        `Gemini API error ${res.status} (model: ${GEMINI_MODEL}):`,
        errText,
      );

      if (res.status === 429) {
        return NextResponse.json({
          reply:
            "I'm receiving a lot of messages right now! Please try again in a moment, or email us at info@setupgram.com 😊",
        });
      }

      return NextResponse.json({
        reply: `I'm having trouble connecting right now. Please reach out to us at info@setupgram.com and we'll get back to you shortly!`,
      });
    }

    // ── 6. Parse response ──────────────────────────────────────────────────
    const data = await res.json();

    const candidate = data?.candidates?.[0];
    if (!candidate) {
      console.error(
        "No candidates in Gemini response:",
        JSON.stringify(data).slice(0, 500),
      );
      return NextResponse.json({
        reply:
          "I couldn't generate a response. Please try rephrasing, or email us at info@setupgram.com!",
      });
    }

    if (candidate.finishReason === "SAFETY") {
      return NextResponse.json({
        reply:
          "I can't help with that particular topic, but I'm happy to answer any questions about SetupGram's services! 😊",
      });
    }

    const reply =
      candidate?.content?.parts?.[0]?.text?.trim() ||
      "Sorry, I didn't catch that. Could you rephrase? Or feel free to email us at info@setupgram.com!";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat route exception:", error);
    return NextResponse.json({
      reply:
        "Something went wrong on my end! Please contact us at info@setupgram.com and we'll be happy to help. 🙏",
    });
  }
}
