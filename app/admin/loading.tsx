/** @format */

// Keeps the admin sidebar visible and shows a spinner while a page's data loads.
export default function AdminLoading() {
  return (
    <div
      className="min-h-[50vh] flex flex-col items-center justify-center gap-4"
      role="status"
      aria-live="polite"
    >
      <div className="h-10 w-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
      <span className="text-sm text-gray-500">Loading…</span>
    </div>
  );
}
