/** @format */

import BlogIndex, { blogIndexMetadata } from "../../components/BlogIndex";

// Cached and refreshed at most every 60s; admin saves refresh it instantly (lib/revalidate.ts)
export const revalidate = 60;

export async function generateMetadata() {
  return blogIndexMetadata(1);
}

export default function BlogPage() {
  return <BlogIndex page={1} />;
}
