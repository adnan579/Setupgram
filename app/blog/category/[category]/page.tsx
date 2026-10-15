/** @format */

import BlogIndex, { blogIndexMetadata } from "../../../../components/BlogIndex";

export const revalidate = 60;
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  return blogIndexMetadata(1, (await params).category);
}

export default async function BlogCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  return <BlogIndex page={1} categorySlug={(await params).category} />;
}
