/** @format */

"use client";

export default function ShareButton({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // fall through to copy
      }
    }
    await navigator.clipboard.writeText(url);
    alert("Verification link copied to clipboard!");
  }

  return (
    <button
      onClick={handleShare}
      className="flex-1 px-5 py-3 rounded-lg border border-white/10 text-gray-300 hover:text-white hover:border-white/30 text-sm font-medium transition-all"
    >
      Share Verification Link
    </button>
  );
}
