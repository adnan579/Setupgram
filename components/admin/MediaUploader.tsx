/** @format */

"use client";

import { useState, useRef, useCallback } from "react";

export type UploadedMedia = {
  url: string;
  publicId: string;
  type: "image" | "video";
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
};

interface Props {
  onInsert: (media: UploadedMedia) => void;
  accept?: "image" | "video" | "both";
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaUploader({ onInsert, accept = "both" }: Props) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [uploaded, setUploaded] = useState<UploadedMedia[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [tab, setTab] = useState<"upload" | "url" | "library">("upload");
  const fileRef = useRef<HTMLInputElement>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const acceptAttr =
    accept === "image"
      ? "image/*"
      : accept === "video"
        ? "video/*"
        : "image/*,video/*";

  const upload = useCallback(
    async (file: File) => {
      setError("");
      setUploading(true);
      setProgress(0);

      const isVideo = file.type.startsWith("video/");
      const resourceType = isVideo ? "video" : "image";

      if (accept === "image" && isVideo) {
        setError("Only images are allowed here.");
        setUploading(false);
        return;
      }
      if (accept === "video" && !isVideo) {
        setError("Only videos are allowed here.");
        setUploading(false);
        return;
      }

      const maxSize = isVideo ? 100 * 1024 * 1024 : 20 * 1024 * 1024;
      if (file.size > maxSize) {
        setError(
          `File too large. Max ${isVideo ? "100MB" : "20MB"}. Your file is ${(
            file.size /
            1024 /
            1024
          ).toFixed(1)}MB.`,
        );
        setUploading(false);
        return;
      }

      try {
        // ── Step 1: Get signed credentials from our server ──────────────────
        let sigPayload: {
          timestamp: number;
          signature: string;
          folder: string;
          cloudName: string;
          apiKey: string;
        };

        try {
          const sigRes = await fetch("/api/admin/upload-signature");
          const sigData = await sigRes.json();

          if (!sigRes.ok || !sigData.success) {
            setError(
              sigData.message ||
                "Could not get upload credentials from server. Check Cloudinary env vars in Vercel.",
            );
            setUploading(false);
            return;
          }

          if (!sigData.cloudName || !sigData.apiKey || !sigData.signature) {
            setError(
              "Server returned incomplete credentials. Verify CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in Vercel environment variables.",
            );
            setUploading(false);
            return;
          }

          sigPayload = sigData;
        } catch {
          setError(
            "Failed to reach signature endpoint. Check your internet connection or Vercel deployment.",
          );
          setUploading(false);
          return;
        }

        const { timestamp, signature, folder, cloudName, apiKey } = sigPayload;

        // ── Step 2: Upload directly from browser → Cloudinary ───────────────
        // IMPORTANT: Only include params that were signed (timestamp + folder).
        // Adding extra params (like transformation) breaks the signature check.
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", apiKey);
        formData.append("timestamp", String(timestamp));
        formData.append("signature", signature);
        formData.append("folder", folder);

        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhrRef.current = xhr;

          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const pct = Math.round((e.loaded / e.total) * 95);
              setProgress(pct);
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const result = JSON.parse(xhr.responseText);
                if (!result.secure_url) {
                  reject(
                    new Error(
                      "Cloudinary returned no URL. Check your Cloudinary plan/account.",
                    ),
                  );
                  return;
                }
                setProgress(100);
                const media: UploadedMedia = {
                  url: result.secure_url,
                  publicId: result.public_id,
                  type: isVideo ? "video" : "image",
                  width: result.width,
                  height: result.height,
                  format: result.format,
                  bytes: result.bytes,
                };
                setUploaded((prev) => [media, ...prev]);
                onInsert(media);
                resolve();
              } catch {
                reject(new Error("Invalid response from Cloudinary"));
              }
            } else {
              // HTTP error from Cloudinary (e.g. 401 bad signature, 400 bad request)
              let errMsg = `Cloudinary error ${xhr.status}`;
              try {
                const errData = JSON.parse(xhr.responseText);
                errMsg = errData?.error?.message || errMsg;
              } catch {
                // keep default
              }
              reject(new Error(errMsg));
            }
          };

          xhr.onerror = () =>
            reject(
              new Error(
                "Network error — could not reach Cloudinary. Check that your Cloudinary Cloud Name is correct in Vercel env vars.",
              ),
            );
          xhr.onabort = () => reject(new Error("Upload cancelled"));

          xhr.open("POST", cloudinaryUrl);
          xhr.send(formData);
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Upload failed. Please retry.";
        setError(message);
      } finally {
        setUploading(false);
        xhrRef.current = null;
        setTimeout(() => setProgress(0), 1500);
      }
    },
    [accept, onInsert],
  );

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    upload(files[0]);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  function handleCancel() {
    xhrRef.current?.abort();
    setUploading(false);
    setProgress(0);
  }

  function handleUrlInsert() {
    if (!urlInput.trim()) return;
    const isVideo = /\.(mp4|webm|ogg|mov)(\?|$)/i.test(urlInput);
    const media: UploadedMedia = {
      url: urlInput.trim(),
      publicId: "",
      type: isVideo ? "video" : "image",
    };
    onInsert(media);
    setUrlInput("");
  }

  const TABS = [
    { id: "upload" as const, label: "Upload" },
    { id: "url" as const, label: "From URL" },
    { id: "library" as const, label: `Library (${uploaded.length})` },
  ];

  return (
    <div className="glass-panel rounded-xl border border-white/10 overflow-hidden">
      {/* Tab Bar */}
      <div className="flex border-b border-white/5">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-5 py-2.5 text-xs font-semibold tracking-wide uppercase transition-all ${
              tab === t.id
                ? "text-primary border-b-2 border-primary bg-primary/5"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-4">
        {/* ── Upload Tab ── */}
        {tab === "upload" && (
          <div className="space-y-4">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => !uploading && fileRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                dragging
                  ? "border-primary bg-primary/10"
                  : "border-white/10 hover:border-primary/40 hover:bg-white/[0.02]"
              } ${uploading ? "pointer-events-none" : ""}`}
            >
              <input
                ref={fileRef}
                type="file"
                accept={acceptAttr}
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />

              {uploading ? (
                <div className="space-y-3">
                  <div className="w-10 h-10 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                    <svg
                      className="animate-spin w-5 h-5 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-400">
                    Uploading to Cloudinary…
                  </p>
                  <div className="w-full max-w-xs mx-auto bg-white/5 rounded-full h-1.5">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600">{progress}%</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancel();
                    }}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors pointer-events-auto"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-white/5 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">
                      Drop{" "}
                      {accept === "image"
                        ? "an image"
                        : accept === "video"
                          ? "a video"
                          : "an image or video"}{" "}
                      here
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      or <span className="text-primary">click to browse</span>
                    </p>
                  </div>
                  <p className="text-xs text-gray-600">
                    {accept === "video"
                      ? "MP4, WebM, MOV up to 100MB"
                      : accept === "image"
                        ? "JPG, PNG, WebP, GIF up to 20MB"
                        : "Images up to 20MB · Videos up to 100MB"}
                  </p>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-3">
                <svg
                  className="w-4 h-4 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}
          </div>
        )}

        {/* ── URL Tab ── */}
        {tab === "url" && (
          <div className="space-y-3">
            <p className="text-xs text-gray-500">
              Paste a direct URL to an image or video hosted elsewhere.
            </p>
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUrlInsert()}
                className="flex-1 px-3 py-2.5 rounded-lg text-sm"
                placeholder="https://example.com/image.jpg"
              />
              <button
                onClick={handleUrlInsert}
                disabled={!urlInput.trim()}
                className="px-4 py-2.5 bg-primary text-dark font-bold text-sm rounded-lg hover:shadow-[0_0_12px_rgba(0,240,255,0.3)] transition-all disabled:opacity-40"
              >
                Insert
              </button>
            </div>
            {urlInput && (
              <div className="rounded-lg overflow-hidden border border-white/5 bg-white/[0.02] p-2">
                {/\.(mp4|webm|ogg|mov)(\?|$)/i.test(urlInput) ? (
                  <video
                    src={urlInput}
                    className="w-full max-h-40 rounded object-contain"
                    controls
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={urlInput}
                    alt="Preview"
                    className="w-full max-h-40 rounded object-contain"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Library Tab ── */}
        {tab === "library" && (
          <div>
            {uploaded.length === 0 ? (
              <p className="text-center text-gray-600 text-sm py-8">
                No uploads yet in this session.{" "}
                <button
                  onClick={() => setTab("upload")}
                  className="text-primary hover:underline"
                >
                  Upload something
                </button>
              </p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {uploaded.map((m, i) => (
                  <button
                    key={i}
                    onClick={() => onInsert(m)}
                    title={`Click to insert • ${m.format?.toUpperCase()} • ${
                      m.bytes ? formatBytes(m.bytes) : ""
                    }`}
                    className="relative group aspect-square rounded-lg overflow-hidden border border-white/5 hover:border-primary/40 transition-all bg-white/[0.02]"
                  >
                    {m.type === "video" ? (
                      <div className="w-full h-full flex items-center justify-center bg-secondary/10">
                        <svg
                          className="w-8 h-8 text-secondary"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={m.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-xs text-dark font-bold bg-primary px-2 py-1 rounded">
                        Insert
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
