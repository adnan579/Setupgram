/** @format */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MediaUploader, { UploadedMedia } from "./MediaUploader";

type CertForm = {
  _id?: string;
  candidateName: string;
  slug: string;
  certificateId?: string;
  type: string;
  program: string;
  issueDate: string;
  startDate: string;
  endDate: string;
  description: string;
  grade: string;
  mentor: string;
  certificateImage: string;
  verificationStatus: "VALID" | "REVOKED";
};

const TYPES = [
  { value: "internship", label: "Internship" },
  { value: "training", label: "Training" },
  { value: "hackathon", label: "Hackathon" },
  { value: "event", label: "Event" },
  { value: "tech-camp", label: "Tech Camp" },
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function CertificateEditor({ initial }: { initial?: CertForm }) {
  const router = useRouter();
  const isEdit = !!initial?._id;

  const [form, setForm] = useState<CertForm>(
    initial || {
      candidateName: "",
      slug: "",
      type: "internship",
      program: "",
      issueDate: new Date().toISOString().slice(0, 10),
      startDate: "",
      endDate: "",
      description: "",
      grade: "",
      mentor: "",
      certificateImage: "",
      verificationStatus: "VALID",
    },
  );

  const [slugManual, setSlugManual] = useState(isEdit);
  const [showUploader, setShowUploader] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    slug: string;
    certificateId: string;
  } | null>(null);

  useEffect(() => {
    if (!slugManual && form.candidateName && form.program) {
      const year = form.issueDate
        ? new Date(form.issueDate).getFullYear()
        : new Date().getFullYear();
      setForm((f) => ({
        ...f,
        slug: slugify(`${f.candidateName}-${f.program}-${year}`),
      }));
    }
  }, [form.candidateName, form.program, form.issueDate, slugManual]);

  function set<K extends keyof CertForm>(field: K, value: CertForm[K]) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleImageInsert(media: UploadedMedia) {
    set("certificateImage", media.url);
    setShowUploader(false);
  }

  async function handleSave() {
    setError("");
    if (!form.candidateName.trim()) {
      setError("Candidate name is required.");
      return;
    }
    if (!form.program.trim()) {
      setError("Program / title is required.");
      return;
    }
    if (!form.issueDate) {
      setError("Issue date is required.");
      return;
    }

    setSaving(true);
    try {
      const url = isEdit
        ? `/api/admin/certificates/${initial!._id}`
        : "/api/admin/certificates";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Something went wrong.");
        return;
      }

      if (!isEdit) {
        setResult({ slug: data.slug, certificateId: data.certificateId });
      } else {
        router.push("/admin/careers/certificates");
        router.refresh();
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (result) {
    const verifyUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/career/verify/${result.slug}`;
    return (
      <div className="glass-panel rounded-2xl p-10 text-center border border-primary/20 max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-5 mx-auto text-primary">
          <svg
            className="w-8 h-8"
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
        <h3 className="text-2xl font-bold text-white mb-2">
          Certificate Issued!
        </h3>
        <p className="text-gray-500 mb-1">Certificate ID</p>
        <p className="font-mono text-primary text-lg mb-4">
          {result.certificateId}
        </p>
        <div className="bg-white/[0.03] rounded-lg p-3 mb-6 break-all text-sm text-gray-300 font-mono">
          {verifyUrl}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigator.clipboard.writeText(verifyUrl)}
            className="px-5 py-2.5 rounded-lg border border-white/10 text-gray-300 hover:text-white hover:border-white/30 text-sm transition-all"
          >
            Copy Link
          </button>
          <a
            href={verifyUrl}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-lg bg-primary text-dark font-bold text-sm hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
          >
            View Verification Page
          </a>
          <button
            onClick={() => router.push("/admin/careers/certificates")}
            className="px-5 py-2.5 rounded-lg border border-white/10 text-gray-300 hover:text-white hover:border-white/30 text-sm transition-all"
          >
            Back to List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 rounded-lg bg-primary text-dark font-bold text-sm hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all disabled:opacity-50"
        >
          {saving
            ? "Saving…"
            : isEdit
              ? "Update Certificate"
              : "Issue Certificate"}
        </button>
      </div>

      {error && (
        <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4">
        {isEdit && initial?.certificateId && (
          <div className="text-xs text-gray-500">
            Certificate ID:{" "}
            <span className="font-mono text-primary">
              {initial.certificateId}
            </span>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
              Candidate Name *
            </label>
            <input
              type="text"
              value={form.candidateName}
              onChange={(e) => set("candidateName", e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm"
              placeholder="Full name"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
              Type *
            </label>
            <select
              value={form.type}
              onChange={(e) => set("type", e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "white",
              }}
            >
              {TYPES.map((t) => (
                <option
                  key={t.value}
                  value={t.value}
                  style={{ background: "#0a0a0a" }}
                >
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
            Program / Title *
          </label>
          <input
            type="text"
            value={form.program}
            onChange={(e) => set("program", e.target.value)}
            className="w-full px-4 py-3 rounded-lg text-sm"
            placeholder="e.g. AI Chatbot Development Internship"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
            Verification Slug *
          </label>
          <div className="flex">
            <span className="px-3 py-3 text-xs text-gray-600 bg-white/[0.02] border border-r-0 border-white/10 rounded-l-lg">
              /career/verify/
            </span>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => {
                setSlugManual(true);
                set("slug", slugify(e.target.value));
              }}
              className="flex-1 px-3 py-3 rounded-l-none rounded-r-lg text-sm font-mono"
              placeholder="candidate-program-2026"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
              Issue Date *
            </label>
            <input
              type="date"
              value={form.issueDate}
              onChange={(e) => set("issueDate", e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => set("startDate", e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
              End Date
            </label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => set("endDate", e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
              Grade / Performance
            </label>
            <input
              type="text"
              value={form.grade}
              onChange={(e) => set("grade", e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm"
              placeholder="Excellent / A+"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
              Mentor / Supervisor
            </label>
            <input
              type="text"
              value={form.mentor}
              onChange={(e) => set("mentor", e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm"
              placeholder="Reporting mentor"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-lg text-sm resize-none"
            placeholder="Brief note on what the candidate accomplished…"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
            Verification Status
          </label>
          <div className="flex gap-2">
            {(["VALID", "REVOKED"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => set("verificationStatus", s)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                  form.verificationStatus === s
                    ? s === "VALID"
                      ? "bg-green-400/20 text-green-400 border-green-400/30"
                      : "bg-red-400/20 text-red-400 border-red-400/30"
                    : "border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4">
        <p className="text-white font-medium mb-1">Certificate Image</p>
        <p className="text-gray-500 text-sm mb-3">
          Upload the certificate design (JPG/PNG). Shown on the public
          verification page and used as the LinkedIn preview image.
        </p>

        {form.certificateImage && (
          <div className="relative rounded-xl overflow-hidden border border-white/10 group w-full max-w-sm mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={form.certificateImage}
              alt="Certificate"
              className="w-full h-auto object-cover"
            />
            <button
              onClick={() => set("certificateImage", "")}
              className="absolute top-2 right-2 w-7 h-7 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <svg
                className="w-3.5 h-3.5"
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
        )}

        {!showUploader ? (
          <button
            onClick={() => setShowUploader(true)}
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-primary transition-colors border border-dashed border-white/10 hover:border-primary/30 rounded-lg px-4 py-3 w-full justify-center"
          >
            {form.certificateImage
              ? "Change Image"
              : "Upload Certificate Image"}
          </button>
        ) : (
          <MediaUploader onInsert={handleImageInsert} accept="image" />
        )}
      </div>
    </div>
  );
}
