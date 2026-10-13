/** @format */
"use client";

import { useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

export default function JobApplyForm({
  jobId,
  jobTitle,
  applyEmail,
}: {
  jobId: string;
  jobTitle: string;
  applyEmail: string;
}) {
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");
  const [resumeName, setResumeName] = useState("");

  async function handleResumeUpload(file: File) {
    setResumeUploading(true);
    setErrorMsg("");
    try {
      const sigRes = await fetch("/api/careers/upload-signature");
      const sig = await sigRes.json();
      if (!sigRes.ok || !sig.success) {
        setErrorMsg(sig.message || "Could not prepare resume upload.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", sig.apiKey);
      formData.append("timestamp", String(sig.timestamp));
      formData.append("signature", sig.signature);
      formData.append("folder", sig.folder);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${sig.cloudName}/raw/upload`,
        { method: "POST", body: formData },
      );
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData.secure_url) {
        setErrorMsg("Resume upload failed. Please try a different file.");
        return;
      }
      setResumeUrl(uploadData.secure_url);
      setResumeName(file.name);
    } catch {
      setErrorMsg("Resume upload failed. Please check your connection.");
    } finally {
      setResumeUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState("loading");
    setErrorMsg("");

    const formData = new FormData(form);
    const body = {
      jobId,
      jobTitle,
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      linkedin: formData.get("linkedin"),
      resumeUrl,
      coverMessage: formData.get("coverMessage"),
    };

    const fallback = `Something went wrong. Please email your resume directly to ${applyEmail}.`;

    let res: Response;
    try {
      res = await fetch("/api/careers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch {
      setState("error");
      setErrorMsg("Network error. Please check your connection and try again.");
      return;
    }

    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.success) {
      setState("error");
      // Show the server's message for 4xx (validation, rate limit); generic for 5xx.
      setErrorMsg(res.status >= 500 ? fallback : data?.message || fallback);
      return;
    }

    setState("success");
    form.reset();
    setResumeUrl("");
    setResumeName("");
  }

  if (state === "success") {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center border border-primary/20">
        <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-4 mx-auto text-primary">
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Application Sent!</h3>
        <p className="text-gray-400 text-sm">
          We'll review your profile and reach out if there's a fit.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/5">
      <h3 className="text-lg font-bold text-white mb-1">Apply for this role</h3>
      <p className="text-xs text-gray-500 mb-5">Takes less than 2 minutes.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">
            Full Name *
          </label>
          <input
            name="name"
            type="text"
            required
            className="w-full px-3.5 py-2.5 rounded-lg text-sm"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">
            Email *
          </label>
          <input
            name="email"
            type="email"
            required
            className="w-full px-3.5 py-2.5 rounded-lg text-sm"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">
            Phone
          </label>
          <input
            name="phone"
            type="tel"
            className="w-full px-3.5 py-2.5 rounded-lg text-sm"
            placeholder="+91 98765 43210"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">
            LinkedIn Profile
          </label>
          <input
            name="linkedin"
            type="url"
            className="w-full px-3.5 py-2.5 rounded-lg text-sm"
            placeholder="https://linkedin.com/in/…"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">
            Resume (PDF)
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) =>
              e.target.files?.[0] && handleResumeUpload(e.target.files[0])
            }
            disabled={resumeUploading}
            className="w-full text-xs text-gray-400 file:mr-3 file:px-3 file:py-2 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 file:cursor-pointer"
          />
          {resumeUploading && (
            <p className="text-xs text-primary mt-1.5">Uploading…</p>
          )}
          {resumeName && !resumeUploading && (
            <p className="text-xs text-green-400 mt-1.5">
              ✓ {resumeName} uploaded
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">
            Cover Message
          </label>
          <textarea
            name="coverMessage"
            rows={3}
            className="w-full px-3.5 py-2.5 rounded-lg text-sm resize-none"
            placeholder="Why are you a great fit?"
          />
        </div>

        {state === "error" && (
          <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2.5">
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={state === "loading" || resumeUploading}
          className="w-full py-3 rounded-lg bg-primary text-dark font-bold text-sm hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all disabled:opacity-60"
        >
          {state === "loading" ? "Submitting…" : "Submit Application"}
        </button>
      </form>
    </div>
  );
}
