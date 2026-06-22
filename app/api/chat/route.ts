/** @format */

import { NextResponse } from "next/server";

// Use gemini-2.5-flash — fastest, most available model on the free tier
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const SYSTEM_INSTRUCTION = `You are Bizzua, the friendly and knowledgeable AI assistant for SetupGram Infotech Solutions — an AI-driven digital agency and strategic consulting firm based in India that serves clients worldwide.

YOUR PERSONALITY:
- Warm, professional, and concise. Never robotic.
- You speak like a helpful business consultant, not a generic chatbot.
- Use short paragraphs. Never write walls of text.
- Use emojis sparingly — only when it adds warmth, not noise.

ABOUT SETUPGRAM:
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
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Explicit check for missing or placeholder key
    if (
      !apiKey ||
      apiKey.trim() === "" ||
      apiKey === "your_gemini_api_key_here"
    ) {
      console.error("GEMINI_API_KEY is not set or is a placeholder.");
      return NextResponse.json({
        reply:
          "I'm Bizzua! I'm currently being configured. Please contact us directly at info@setupgram.com — we'd love to hear from you! 😊",
      });
    }

    // Build contents array — only user/model turns, NO fake system turn
    // Gemini uses systemInstruction separately
    const contents = messages
      .filter((m: { role: string; content: string }) => m.content?.trim())
      .map((m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    // Gemini requires alternating user/model turns.
    // Ensure the array starts with a user turn and has no consecutive same roles.
    const sanitized: { role: string; parts: { text: string }[] }[] = [];
    for (const turn of contents) {
      const last = sanitized[sanitized.length - 1];
      if (last && last.role === turn.role) {
        // Merge consecutive same-role messages
        last.parts[0].text += "\n" + turn.parts[0].text;
      } else {
        sanitized.push({ ...turn, parts: [{ text: turn.parts[0].text }] });
      }
    }

    // Must start with user turn
    if (sanitized.length === 0 || sanitized[0].role !== "user") {
      return NextResponse.json({
        reply: "Hi! How can I help you today? 😊",
      });
    }

    const requestBody = {
      // System instruction — the proper way in Gemini API
      system_instruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }],
      },
      contents: sanitized,
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

    // Log the full error from Gemini for debugging
    if (!res.ok) {
      const errText = await res.text();
      console.error(`Gemini API error ${res.status}:`, errText);
      return NextResponse.json({
        reply: `I'm having trouble connecting right now (error ${res.status}). Please reach out to us at info@setupgram.com and we'll get back to you shortly!`,
      });
    }

    const data = await res.json();

    // Handle blocked responses (safety filters)
    const candidate = data?.candidates?.[0];
    if (!candidate) {
      console.error("No candidates in Gemini response:", JSON.stringify(data));
      return NextResponse.json({
        reply:
          "I couldn't generate a response. Please try rephrasing, or email us at info@setupgram.com!",
      });
    }

    // Check finish reason
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
