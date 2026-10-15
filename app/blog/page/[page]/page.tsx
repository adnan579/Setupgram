/** @format */

import { notFound } from "next/navigation";
import BlogIndex, { blogIndexMetadata, parsePage } from "../../../../components/BlogIndex";

export const revalidate = 60;
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }) {
  const page = parsePage((await params).page);
  if (!page) return { title: "Page Not Found" };
  return blogIndexMetadata(page);
}

export default async function BlogPageN({ params }: { params: Promise<{ page: string }> }) {
  const page = parsePage((await params).page);
  if (!page) notFound();
  return <BlogIndex page={page} />;
}
