/** @format */

// Renders structured data (JSON-LD) for search engines.
// "<" is escaped so content that came from the database (post titles, etc.) can never close
// the script tag early.
export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
