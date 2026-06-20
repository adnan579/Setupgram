/** @format */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type QuickReply = { label: string; value: string };

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi there! 👋 I'm **Bizzua**, SetupGram's AI assistant.\n\nI can help you explore our services, answer questions, or connect you with our team. What brings you here today?",
  timestamp: new Date(),
};

const INITIAL_QUICK_REPLIES: QuickReply[] = [
  { label: "🚀 Our Services", value: "What services does SetupGram offer?" },
  { label: "💬 AI Chatbots", value: "Tell me about your AI chatbot service" },
  { label: "📣 Advertising", value: "Tell me about your advertising services" },
  { label: "📞 Get in Touch", value: "I want to get in touch with the team" },
  { label: "💰 Pricing", value: "How does your pricing work?" },
];

// Very lightweight markdown → JSX renderer (bold, links, line breaks)
function renderMarkdown(text: string) {
  const lines = text.split("\n");
  return lines.map((line, li) => {
    // Parse inline: **bold** and [text](url)
    const parts: React.ReactNode[] = [];
    let remaining = line;
    let key = 0;

    while (remaining.length > 0) {
      // Bold
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      // Link
      const linkMatch = remaining.match(/\[(.+?)\]\((.+?)\)/);

      const boldIdx = boldMatch ? remaining.indexOf(boldMatch[0]) : Infinity;
      const linkIdx = linkMatch ? remaining.indexOf(linkMatch[0]) : Infinity;

      if (boldMatch && boldIdx <= linkIdx) {
        if (boldIdx > 0)
          parts.push(<span key={key++}>{remaining.slice(0, boldIdx)}</span>);
        parts.push(
          <strong key={key++} className="text-white font-semibold">
            {boldMatch[1]}
          </strong>,
        );
        remaining = remaining.slice(boldIdx + boldMatch[0].length);
      } else if (linkMatch && linkIdx < Infinity) {
        if (linkIdx > 0)
          parts.push(<span key={key++}>{remaining.slice(0, linkIdx)}</span>);
        const isExternal = linkMatch[2].startsWith("http");
        parts.push(
          isExternal ? (
            <a
              key={key++}
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:text-white transition-colors"
            >
              {linkMatch[1]}
            </a>
          ) : (
            <Link
              key={key++}
              href={linkMatch[2]}
              className="text-primary underline underline-offset-2 hover:text-white transition-colors"
            >
              {linkMatch[1]}
            </Link>
          ),
        );
        remaining = remaining.slice(linkIdx + linkMatch[0].length);
      } else {
        parts.push(<span key={key++}>{remaining}</span>);
        remaining = "";
      }
    }

    return (
      <span key={li}>
        {parts}
        {li < lines.length - 1 && <br />}
      </span>
    );
  });
}

function BizzuaAvatar({ size = "sm" }: { size?: "sm" | "lg" }) {
  const s = size === "lg" ? "w-10 h-10 text-base" : "w-7 h-7 text-xs";
  return (
    <div
      className={`${s} rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-dark flex-shrink-0`}
    >
      B
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <BizzuaAvatar />
      <div className="glass-panel rounded-2xl rounded-bl-sm px-4 py-3 border border-white/5">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Bizzua() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>(
    INITIAL_QUICK_REPLIES,
  );
  const [showBadge, setShowBadge] = useState(false);
  const [unread, setUnread] = useState(0);
  const [hasOpened, setHasOpened] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (open && !minimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open, minimized, loading]);

  // Show attention badge after 8 seconds if not opened
  useEffect(() => {
    const t = setTimeout(() => {
      if (!hasOpened) {
        setShowBadge(true);
        setUnread(1);
      }
    }, 8000);
    return () => clearTimeout(t);
  }, [hasOpened]);

  function handleOpen() {
    setOpen(true);
    setMinimized(false);
    setHasOpened(true);
    setShowBadge(false);
    setUnread(0);
    setTimeout(() => inputRef.current?.focus(), 300);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleMinimize() {
    setMinimized(true);
    setOpen(false);
    setUnread(0);
  }

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;
      setInput("");
      setQuickReplies([]);

      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        content: text.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);

      try {
        // Build history for API (exclude welcome message id)
        const history = [...messages, userMsg].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
        });

        const data = await res.json();
        const reply =
          data.reply || "Sorry, I couldn't get a response. Please try again!";

        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: reply,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMsg]);

        // Generate contextual quick replies based on response content
        const lower = reply.toLowerCase();
        const nextReplies: QuickReply[] = [];

        if (lower.includes("service") || lower.includes("offer")) {
          nextReplies.push({
            label: "📣 Advertising",
            value: "Tell me about advertising campaigns",
          });
          nextReplies.push({
            label: "🤖 AI Chatbots",
            value: "How do AI chatbots work?",
          });
        }
        if (
          lower.includes("contact") ||
          lower.includes("touch") ||
          lower.includes("team")
        ) {
          nextReplies.push({
            label: "📋 Fill Contact Form",
            value: "I want to get in touch with the team",
          });
        }
        if (
          lower.includes("price") ||
          lower.includes("cost") ||
          lower.includes("quote")
        ) {
          nextReplies.push({
            label: "📞 Get a Quote",
            value: "I want to get in touch with the team",
          });
        }
        if (lower.includes("app") || lower.includes("development")) {
          nextReplies.push({
            label: "📱 App Development",
            value: "Tell me more about app development",
          });
        }
        if (lower.includes("blog") || lower.includes("article")) {
          nextReplies.push({
            label: "📖 Visit Blog",
            value: "Where can I read your blog?",
          });
        }

        // Always add a fallback
        if (nextReplies.length < 2) {
          nextReplies.push({
            label: "🔍 More Questions",
            value: "What else can you help me with?",
          });
          nextReplies.push({
            label: "📞 Talk to Team",
            value: "I want to speak with someone from your team",
          });
        }

        setQuickReplies(nextReplies.slice(0, 3));
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content:
              "I hit a small snag! Please try again or email us at info@setupgram.com 🙏",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [messages, loading],
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleQuickReply(value: string) {
    sendMessage(value);
  }

  function handleReset() {
    setMessages([WELCOME_MESSAGE]);
    setQuickReplies(INITIAL_QUICK_REPLIES);
    setInput("");
  }

  const isOpen = open && !minimized;

  return (
    <>
      {/* ── Chat Window ── */}
      <div
        className={`fixed bottom-24 right-5 sm:right-6 z-[9999] transition-all duration-300 ease-out ${
          isOpen
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 translate-y-4 scale-95 pointer-events-none"
        }`}
        style={{ width: "min(380px, calc(100vw - 20px))" }}
      >
        <div
          className="flex flex-col rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(0,240,255,0.15)] border border-white/10"
          style={{
            background: "#0a0a0f",
            maxHeight: "min(580px, calc(100vh - 120px))",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,240,255,0.08), rgba(176,38,255,0.08))",
            }}
          >
            <BizzuaAvatar size="lg" />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-sm">Bizzua</p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <p className="text-xs text-gray-400">SetupGram AI Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                title="New conversation"
                className="p-1.5 text-gray-500 hover:text-gray-300 rounded-lg hover:bg-white/5 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
              <button
                onClick={handleMinimize}
                title="Minimize"
                className="p-1.5 text-gray-500 hover:text-gray-300 rounded-lg hover:bg-white/5 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 12H4"
                  />
                </svg>
              </button>
              <button
                onClick={handleClose}
                title="Close"
                className="p-1.5 text-gray-500 hover:text-red-400 rounded-lg hover:bg-red-400/10 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(0,240,255,0.2) transparent",
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {msg.role === "assistant" && <BizzuaAvatar />}

                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-dark font-medium rounded-br-sm"
                      : "glass-panel text-gray-200 border border-white/5 rounded-bl-sm"
                  }`}
                >
                  {msg.role === "assistant"
                    ? renderMarkdown(msg.content)
                    : msg.content}
                </div>
              </div>
            ))}

            {loading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {quickReplies.length > 0 && !loading && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {quickReplies.map((qr) => (
                <button
                  key={qr.value}
                  onClick={() => handleQuickReply(qr.value)}
                  className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary hover:text-dark transition-all font-medium"
                >
                  {qr.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="px-4 pb-4 pt-2 border-t border-white/5"
          >
            <div className="flex gap-2 items-center">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Bizzua anything…"
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm disabled:opacity-50 focus:ring-1 focus:ring-primary/30"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "white",
                }}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-10 h-10 flex-shrink-0 rounded-xl bg-primary text-dark flex items-center justify-center hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
            <p className="text-center text-xs text-gray-700 mt-2">
              Powered by Gemini AI · SetupGram
            </p>
          </form>
        </div>
      </div>

      {/* ── Launcher Button ── */}
      <button
        onClick={handleOpen}
        aria-label="Open Bizzua chat assistant"
        className={`fixed bottom-5 right-5 sm:right-6 z-[9999] w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-all duration-300 hover:scale-110 active:scale-95 ${
          isOpen
            ? "opacity-0 pointer-events-none scale-90"
            : "opacity-100 scale-100"
        }`}
        style={{ background: "linear-gradient(135deg, #00f0ff, #b026ff)" }}
      >
        {/* Pulse ring */}
        {showBadge && (
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{ background: "rgba(0,240,255,0.3)" }}
          />
        )}

        {/* Unread badge */}
        {unread > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
            {unread}
          </div>
        )}

        {/* Icon */}
        <svg
          className="w-6 h-6 text-dark"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
        </svg>
      </button>

      {/* ── Attention tooltip (shown once after delay) ── */}
      {showBadge && !hasOpened && (
        <div
          className="fixed bottom-[5.5rem] right-5 sm:right-6 z-[9998] glass-panel rounded-xl px-4 py-3 border border-primary/20 shadow-lg max-w-[200px] animate-fade-in cursor-pointer"
          onClick={handleOpen}
        >
          <p className="text-sm text-white font-medium leading-snug">
            👋 Hi! I'm Bizzua. Need help?
          </p>
          <div
            className="absolute bottom-[-6px] right-6 w-3 h-3 rotate-45 border-b border-r border-primary/20"
            style={{ background: "rgba(255,255,255,0.03)" }}
          />
        </div>
      )}
    </>
  );
}
