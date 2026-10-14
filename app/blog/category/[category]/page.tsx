/** @format */

import BlogIndex, { blogIndexMetadata } from "../../../../components/BlogIndex";

export const revalidate = 60;
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: { category: string } }) {
  return blogIndexMetadata(1, params.category);
}

export default function BlogCategoryPage({ params }: { params: { category: string } }) {
  return <BlogIndex page={1} categorySlug={params.category} />;
}
