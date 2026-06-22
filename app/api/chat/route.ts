/** @format */

import { NextResponse } from "next/server";

// Updated to the latest and most capable free-tier model
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
    // 1. Extract the user's message from the incoming request
    const body = await req.json();
    const userMessage = body.message; // Adjust 'message' based on your frontend payload

    if (!userMessage) {
      return NextResponse.json(
        { reply: "I didn't receive a message. Could you try rephrasing?" },
        { status: 400 },
      );
    }

    // 2. Ensure the API key is present in your environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing from environment variables.");
      return NextResponse.json(
        {
          reply:
            "Server configuration error. Please contact info@setupgram.com!",
        },
        { status: 500 },
      );
    }

    // 3. Construct the payload matching the strict Gemini REST API schema
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
        temperature: 0.7, // Helps keep the bot creative but focused
        maxOutputTokens: 1024,
      },
    };

    // 4. Execute the fetch request securely using headers
    const res = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    // 5. Handle HTTP-level errors (4xx, 5xx)
    if (!res.ok) {
      const errText = await res.text();
      console.error(`Gemini API error ${res.status}:`, errText);
      return NextResponse.json({
        reply: `I'm having trouble connecting right now (error ${res.status}). Please reach out to us at info@setupgram.com and we'll get back to you shortly!`,
      });
    }

    const data = await res.json();

    // 6. Handle blocked responses or empty candidates
    const candidate = data?.candidates?.[0];
    if (!candidate) {
      console.error("No candidates in Gemini response:", JSON.stringify(data));
      return NextResponse.json({
        reply:
          "I couldn't generate a response. Please try rephrasing, or email us at info@setupgram.com!",
      });
    }

    // 7. Check the safety finish reason
    if (candidate.finishReason === "SAFETY") {
      return NextResponse.json({
        reply:
          "I can't help with that particular topic, but I'm happy to answer any questions about SetupGram's services! 😊",
      });
    }

    // 8. Extract the text safely
    const reply =
      candidate?.content?.parts?.[0]?.text?.trim() ||
      "Sorry, I didn't catch that. Could you rephrase? Or feel free to email us at info@setupgram.com!";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat route exception:", error);
    return NextResponse.json({
      reply:
        "Something went wrong on my end! Please contact us at info@setupgram.com",
    });
  }
}
