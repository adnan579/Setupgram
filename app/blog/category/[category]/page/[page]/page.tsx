/** @format */

import { notFound } from "next/navigation";
import BlogIndex, { blogIndexMetadata, parsePage } from "../../../../../../components/BlogIndex";

export const revalidate = 60;
export async function generateStaticParams() {
  return [];
}

type Params = { category: string; page: string };

export async function generateMetadata({ params }: { params: Params }) {
  const page = parsePage(params.page);
  if (!page) return { title: "Page Not Found" };
  return blogIndexMetadata(page, params.category);
}

export default function BlogCategoryPageN({ params }: { params: Params }) {
  const page = parsePage(params.page);
  if (!page) notFound();
  return <BlogIndex page={page} categorySlug={params.category} />;
}
