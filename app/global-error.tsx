/** @format */

"use client";

// Last-resort boundary: replaces the root layout when the layout itself crashes.
// Tailwind/global CSS is not available here, so it uses inline styles.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050505",
          color: "#e2e8f0",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 420 }}>
          <h1 style={{ fontSize: 24, marginBottom: 12 }}>Something went wrong</h1>
          <p style={{ color: "#94a3b8", marginBottom: 24 }}>
            Please try again in a moment.
          </p>
          <button
            onClick={reset}
            style={{
              padding: "12px 28px",
              borderRadius: 9999,
              border: 0,
              background: "#00f0ff",
              color: "#050505",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
