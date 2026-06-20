/** @format */

"use client";

import { useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const body = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      service: formData.get("service"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Server error");

      setState("success");
      (e.target as HTMLFormElement).reset();
    } catch {
      setState("error");
      setErrorMsg("Something went wrong. Please try again or email us directly.");
    }
  }

  if (state === "success") {
    return (
      <div className="glass-panel rounded-2xl p-10 flex flex-col items-center justify-center text-center min-h-[480px]">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-5 text-primary">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">Message Sent!</h3>
        <p className="text-gray-400 mb-8 max-w-xs">
          Thanks for reaching out. We'll get back to you within 24 hours.
        </p>
        <button
          onClick={() => setState("idle")}
          className="text-sm text-primary hover:text-white transition-colors underline underline-offset-4"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-8">
      <h2 className="text-xl font-bold text-white mb-6">Send a Message</h2>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
            Full Name <span className="text-primary">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full px-4 py-3 rounded-lg"
            placeholder="John Doe"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
            Email Address <span className="text-primary">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-4 py-3 rounded-lg"
            placeholder="john@example.com"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-2">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="w-full px-4 py-3 rounded-lg"
            placeholder="+91 98765 43210"
          />
        </div>

        {/* Service interest */}
        <div>
          <label htmlFor="service" className="block text-sm font-medium text-gray-400 mb-2">
            I'm interested in
          </label>
          <select
            id="service"
            name="service"
            className="w-full px-4 py-3 rounded-lg appearance-none cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "white",
            }}
          >
            <option value="" style={{ background: "#050505" }}>Select a service…</option>
            <option value="app-development" style={{ background: "#050505" }}>App Development</option>
            <option value="ai-chatbot" style={{ background: "#050505" }}>AI Chatbot Integration</option>
            <option value="crm" style={{ background: "#050505" }}>CRM Solutions</option>
            <option value="digital-marketing" style={{ background: "#050505" }}>Digital Marketing</option>
            <option value="advertising" style={{ background: "#050505" }}>Advertising (Google, Meta, etc.)</option>
            <option value="consulting" style={{ background: "#050505" }}>Business Consulting</option>
            <option value="other" style={{ background: "#050505" }}>Something Else</option>
          </select>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">
            Message <span className="text-primary">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            className="w-full px-4 py-3 rounded-lg resize-none"
            placeholder="Tell us about your project or goals…"
          />
        </div>

        {/* Error message */}
        {state === "error" && (
          <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
            {errorMsg}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={state === "loading"}
          className="w-full py-4 rounded-lg bg-primary text-dark font-bold hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex justify-center items-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {state === "loading" ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-dark"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Sending…
            </>
          ) : (
            "Send Message"
          )}
        </button>
      </form>
    </div>
  );
}
