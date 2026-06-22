/** @format */

import { NextResponse } from "next/server";

// 1. VERCEL FIX: Force dynamic rendering so Next.js never caches this API route.
export const dynamic = "force-dynamic";

// Using the most capable Free Tier model (gemini-3.5-flash)
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent";

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

export async function POST(req: Request) {
  try {
    // 2. Resilient Parsing: Catch cases where the frontend payload is malformed
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error("Failed to parse request JSON:", parseError);
      return NextResponse.json(
        { reply: "Invalid request format. Expected JSON." },
        { status: 400 },
      );
    }

    // Support multiple common frontend variable names
    const userMessage = body.message || body.prompt || body.text;

    if (!userMessage) {
      return NextResponse.json(
        { reply: "I didn't receive a message. Could you try rephrasing?" },
        { status: 400 },
      );
    }

    // 3. Environment Variable Check
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("CRITICAL ERROR: GEMINI_API_KEY is undefined.");
      return NextResponse.json(
        {
          reply:
            "Server configuration error. API key is missing on the server.",
        },
        { status: 500 },
      );
    }

    const payload = {
      systemInstruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: userMessage }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    };

    // 4. VERCEL FIX: Attach the key directly to the URL to prevent header-stripping
    const urlWithKey = `${GEMINI_API_URL}?key=${apiKey}`;

    const res = await fetch(urlWithKey, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // 5. Verbose Error Logging for production debugging
    if (!res.ok) {
      const errText = await res.text();
      console.error(`Gemini API error ${res.status}:`, errText);
      return NextResponse.json(
        { reply: `Google API Error ${res.status}. Check Vercel Server Logs.` },
        { status: res.status },
      );
    }

    const data = await res.json();

    const candidate = data?.candidates?.[0];
    if (!candidate) {
      console.error("No candidates in Gemini response:", data);
      return NextResponse.json(
        { reply: "I couldn't generate a response. Please try rephrasing!" },
        { status: 500 },
      );
    }

    if (candidate.finishReason === "SAFETY") {
      return NextResponse.json({
        reply:
          "I can't help with that particular topic, but I'm happy to answer any questions about SetupGram's services! 😊",
      });
    }

    const reply =
      candidate?.content?.parts?.[0]?.text?.trim() ||
      "Sorry, I didn't catch that. Could you rephrase?";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat route exception:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { reply: `Server encountered an error: ${errorMessage}` },
      { status: 500 },
    );
  }
}
