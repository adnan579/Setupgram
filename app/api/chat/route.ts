/** @format */

import { NextResponse } from "next/server";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const SYSTEM_PROMPT = `You are Bizzua, the friendly and knowledgeable AI assistant for SetupGram Infotech Solutions — an AI-driven digital agency and strategic consulting firm based in India that serves clients worldwide.

YOUR PERSONALITY:
- Warm, professional, and concise. Never robotic.
- You speak like a helpful business consultant, not a generic chatbot.
- Use short paragraphs. Never write walls of text.
- Use emojis sparingly — only when it adds warmth, not noise.

ABOUT SETUPGRAM (know this deeply):
- Website: setupgram.com
- Email: info@setupgram.com
- Tagline: "Perfect Place For Business Solutions"
- SetupGram helps businesses grow online through technology and strategy.

SERVICES (you must know these perfectly):
1. **App Development** — Web, Android, and iOS apps built end-to-end. Fast, scalable, and tailored to the client's business.
2. **AI Chatbots** (Core Service) — Intelligent AI chatbot integration for websites and apps to automate customer support and scale sales. This is SetupGram's flagship service.
3. **CRM Solutions** — Custom CRM systems that replace clunky off-the-shelf tools like HubSpot/Salesforce with something built exactly for the client's workflow.
4. **Digital Marketing** — SEO, social media campaigns, and performance marketing with measurable ROI.
5. **Advertising** — High-end paid advertising campaigns across ALL major platforms: Google Ads, Meta (Facebook/Instagram), LinkedIn, YouTube, Twitter/X, and more. Full-funnel strategy from creative to conversion tracking.
6. **Business Consulting** — Strategic roadmaps, digital transformation plans, and market entry strategies for businesses going online.

PAGES ON THE WEBSITE:
- / (Home) — Hero, Services, Consulting, Testimonials
- /about — Mission, Team, Values, Blog
- /contact — Contact form to get in touch
- /blog/[slug] — Blog articles on AI, marketing, development

YOUR CAPABILITIES:
1. **Answer questions** about SetupGram's services, pricing approach, team, and capabilities.
2. **Navigate users** — tell them which page to visit for what they need.
3. **Qualify leads** — if someone seems interested in a service, guide them toward /contact.
4. **Run the contact intake** — if a user wants to reach out, collect: name, email, service interest, and project description in a friendly step-by-step conversation. At the end, summarize and tell them to submit via /contact or that you'll note their details.
5. **Explain services** in detail when asked.
6. **Handle objections** — address concerns about cost, timeline, or fit professionally.

CONTACT FORM FLOW (use this exact sequence when user wants to get in touch):
Step 1: "Great! First, what's your name?"
Step 2: "Nice to meet you, [name]! What's your email address?"
Step 3: "Which service are you most interested in?" (list the 6 services as options)
Step 4: "Tell me a bit about your project or what you're trying to achieve."
Step 5: Summarize all details and say: "Perfect! I've got everything. You can submit this on our [Contact page](/contact), or our team will reach out to [email] within 24 hours. 🚀"

RULES:
- NEVER make up pricing. Say "pricing depends on the project scope — our team will give you a custom quote after understanding your needs."
- NEVER claim to do things outside SetupGram's 6 services.
- If asked something completely off-topic (weather, general knowledge, etc.), politely redirect: "I'm Bizzua, SetupGram's assistant! I'm best at helping with digital business questions. Is there something about our services I can help with?"
- Keep responses under 120 words unless a detailed explanation is explicitly requested.
- When referencing a page, use markdown links: [Contact page](/contact)`;

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return NextResponse.json({
        reply: "I'm Bizzua! I'm currently being set up. Please contact us directly at info@setupgram.com — we'd love to hear from you! 😊",
      });
    }

    // Build Gemini contents array — prepend system prompt as first user turn
    const contents = [
      {
        role: "user",
        parts: [{ text: SYSTEM_PROMPT }],
      },
      {
        role: "model",
        parts: [{ text: "Understood! I'm Bizzua, SetupGram's assistant. I'm ready to help visitors learn about our services and get in touch." }],
      },
      // Conversation history
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
    ];

    const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 400,
          topP: 0.9,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Gemini API error:", err);
      return NextResponse.json({
        reply: "I'm having a small hiccup right now. Please reach out to us at info@setupgram.com and we'll get back to you shortly!",
      });
    }

    const data = await res.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I didn't catch that. Could you rephrase? Or feel free to email us at info@setupgram.com!";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat route error:", error);
    return NextResponse.json({
      reply: "Something went wrong on my end! Please contact us at info@setupgram.com and we'll be happy to help. 🙏",
    });
  }
}
