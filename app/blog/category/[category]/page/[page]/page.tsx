/** @format */

import { notFound } from "next/navigation";
import BlogIndex, { blogIndexMetadata, parsePage } from "../../../../../../components/BlogIndex";

export const revalidate = 60;
export async function generateStaticParams() {
  return [];
}

type Params = Promise<{ category: string; page: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { category, page: rawPage } = await params;
  const page = parsePage(rawPage);
  if (!page) return { title: "Page Not Found" };
  return blogIndexMetadata(page, category);
}

export default async function BlogCategoryPageN({ params }: { params: Params }) {
  const { category, page: rawPage } = await params;
  const page = parsePage(rawPage);
  if (!page) notFound();
  return <BlogIndex page={page} categorySlug={category} />;
}
