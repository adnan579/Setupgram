/** @format */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type JobForm = {
  _id?: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  employmentType: string;
  experience: string;
  salaryRange: string;
  excerpt: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  status: "DRAFT" | "OPEN" | "CLOSED";
  applyEmail: string;
  closingDate: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
};

const DEPARTMENTS = [
  "Engineering",
  "AI & Chatbots",
  "Design",
  "Marketing",
  "Sales",
  "Consulting",
  "Operations",
  "Internship",
];
const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Internship", "Contract"];

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
function linesToArray(text: string) {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}
function arrayToLines(arr: string[]) {
  return (arr || []).join("\n");
}

export default function JobEditor({ initial }: { initial?: JobForm }) {
  const router = useRouter();
  const isEdit = !!initial?._id;

  const [form, setForm] = useState<JobForm>(
    initial || {
      title: "",
      slug: "",
      department: DEPARTMENTS[0],
      location: "Remote / India",
      employmentType: "Full-time",
      experience: "0-1 years",
      salaryRange: "",
      excerpt: "",
      description: "",
      responsibilities: [],
      requirements: [],
      benefits: [],
      status: "DRAFT",
      applyEmail: "careers@setupgram.com",
      closingDate: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
    },
  );

  const [respText, setRespText] = useState(arrayToLines(form.responsibilities));
  const [reqText, setReqText] = useState(arrayToLines(form.requirements));
  const [benText, setBenText] = useState(arrayToLines(form.benefits));
  const [slugManual, setSlugManual] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"content" | "seo">("content");

  useEffect(() => {
    if (!slugManual && form.title)
      setForm((f) => ({ ...f, slug: slugify(f.title) }));
  }, [form.title, slugManual]);

  function set<K extends keyof JobForm>(field: K, value: JobForm[K]) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSave(status: "DRAFT" | "OPEN" | "CLOSED") {
    setError("");
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!form.slug.trim()) {
      setError("Slug is required.");
      return;
    }
    if (!form.description.trim()) {
      setError("Description is required.");
      return;
    }
    if (!form.applyEmail.trim()) {
      setError("An apply email is required.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        status,
        responsibilities: linesToArray(respText),
        requirements: linesToArray(reqText),
        benefits: linesToArray(benText),
      };
      const url = isEdit
        ? `/api/admin/jobs/${initial!._id}`
        : "/api/admin/jobs";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Something went wrong.");
        return;
      }
      router.push("/admin/careers/jobs");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
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
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleSave("DRAFT")}
            disabled={saving}
            className="px-4 py-2 rounded-lg border border-white/10 text-gray-300 hover:text-white hover:border-white/30 text-sm transition-all disabled:opacity-50"
          >
            Save Draft
          </button>
          {isEdit && (
            <button
              onClick={() => handleSave("CLOSED")}
              disabled={saving}
              className="px-4 py-2 rounded-lg border border-red-400/30 text-red-400 hover:bg-red-400/10 text-sm transition-all disabled:opacity-50"
            >
              Close Job
            </button>
          )}
          <button
            onClick={() => handleSave("OPEN")}
            disabled={saving}
            className="px-5 py-2 rounded-lg bg-primary text-dark font-bold text-sm hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all disabled:opacity-50"
          >
            {saving ? "Saving…" : isEdit ? "Update & Publish" : "Publish Job"}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="flex gap-1 p-1 glass-panel rounded-xl w-fit border border-white/5">
        {(["content", "seo"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === t ? "bg-primary/20 text-primary border border-primary/20" : "text-gray-400 hover:text-white"}`}
          >
            {t === "content" ? "Content" : "SEO & Settings"}
          </button>
        ))}
      </div>

      {activeTab === "content" && (
        <div className="space-y-5">
          <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4">
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                Job Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-lg font-bold"
                placeholder="e.g. Frontend Developer (React)"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                Slug *
              </label>
              <div className="flex">
                <span className="px-3 py-3 text-xs text-gray-600 bg-white/[0.02] border border-r-0 border-white/10 rounded-l-lg">
                  /career/jobs/
                </span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugManual(true);
                    set("slug", slugify(e.target.value));
                  }}
                  className="flex-1 px-3 py-3 rounded-l-none rounded-r-lg text-sm font-mono"
                  placeholder="frontend-developer"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                  Department
                </label>
                <select
                  value={form.department}
                  onChange={(e) => set("department", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-sm cursor-pointer"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "white",
                  }}
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d} style={{ background: "#0a0a0a" }}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                  Employment Type
                </label>
                <select
                  value={form.employmentType}
                  onChange={(e) => set("employmentType", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-sm cursor-pointer"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "white",
                  }}
                >
                  {EMPLOYMENT_TYPES.map((t) => (
                    <option key={t} value={t} style={{ background: "#0a0a0a" }}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-sm"
                  placeholder="Remote / Prayagraj"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                  Experience
                </label>
                <input
                  type="text"
                  value={form.experience}
                  onChange={(e) => set("experience", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-sm"
                  placeholder="0-1 years"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                  Salary Range
                </label>
                <input
                  type="text"
                  value={form.salaryRange}
                  onChange={(e) => set("salaryRange", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-sm"
                  placeholder="Confidential / ₹3-5 LPA"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                Short Pitch (Excerpt)
              </label>
              <textarea
                value={form.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
                rows={2}
                className="w-full px-4 py-3 rounded-lg text-sm resize-none"
                placeholder="A one-line hook shown on the careers page…"
              />
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4">
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                Full Description (HTML supported) *
              </label>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={10}
                className="w-full px-4 py-3 rounded-lg text-sm font-mono resize-y leading-relaxed"
                placeholder={`<p>Tell candidates about the role…</p>`}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                Responsibilities{" "}
                <span className="text-gray-600 font-normal normal-case">
                  (one per line)
                </span>
              </label>
              <textarea
                value={respText}
                onChange={(e) => setRespText(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-lg text-sm resize-y"
                placeholder={
                  "Build and maintain features\nCollaborate with design team"
                }
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                Requirements{" "}
                <span className="text-gray-600 font-normal normal-case">
                  (one per line)
                </span>
              </label>
              <textarea
                value={reqText}
                onChange={(e) => setReqText(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-lg text-sm resize-y"
                placeholder={"1+ years with React\nStrong problem solving"}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                Benefits{" "}
                <span className="text-gray-600 font-normal normal-case">
                  (one per line)
                </span>
              </label>
              <textarea
                value={benText}
                onChange={(e) => setBenText(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-lg text-sm resize-y"
                placeholder={"Flexible working hours\nRemote-first culture"}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === "seo" && (
        <div className="space-y-5">
          <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4">
            <p className="text-white font-medium">Application Settings</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                  Apply Notification Email *
                </label>
                <input
                  type="email"
                  value={form.applyEmail}
                  onChange={(e) => set("applyEmail", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-sm"
                  placeholder="careers@setupgram.com"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                  Closing Date{" "}
                  <span className="text-gray-600 font-normal normal-case">
                    (optional)
                  </span>
                </label>
                <input
                  type="date"
                  value={form.closingDate}
                  onChange={(e) => set("closingDate", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4">
            <p className="text-white font-medium">SEO Settings</p>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                Meta Title
              </label>
              <input
                type="text"
                value={form.metaTitle}
                onChange={(e) => set("metaTitle", e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm"
                placeholder={form.title || "Job Title | Careers at SetupGram"}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                Meta Description
              </label>
              <textarea
                value={form.metaDescription}
                onChange={(e) => set("metaDescription", e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-lg text-sm resize-none"
                placeholder={
                  form.excerpt || "A concise summary for Google search results…"
                }
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                Meta Keywords
              </label>
              <input
                type="text"
                value={form.metaKeywords}
                onChange={(e) => set("metaKeywords", e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm"
                placeholder="react developer job, careers, hiring"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
