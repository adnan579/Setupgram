/** @format */

import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "../../../../../lib/mongodb";
import { revalidateBlogs } from "../../../../../lib/revalidate";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const {
      title, category, excerpt, content, slug, status,
      coverImage, metaTitle, metaDescription, metaKeywords,
    } = body;

    const db = await getDb();

    if (slug) {
      const existing = await db.collection("blogs").findOne({
        slug,
        _id: { $ne: new ObjectId(id) },
      });
      if (existing) {
        return NextResponse.json(
          { success: false, message: "A post with this slug already exists." },
          { status: 409 }
        );
      }
    }

    const updateFields: Record<string, unknown> = { updatedAt: new Date() };
    if (title !== undefined)           updateFields.title = title;
    if (category !== undefined)        updateFields.category = category;
    if (excerpt !== undefined)         updateFields.excerpt = excerpt;
    if (content !== undefined)         updateFields.content = content;
    if (slug !== undefined)            updateFields.slug = slug;
    if (coverImage !== undefined)      updateFields.coverImage = coverImage;
    if (metaTitle !== undefined)       updateFields.metaTitle = metaTitle;
    if (metaDescription !== undefined) updateFields.metaDescription = metaDescription;
    if (metaKeywords !== undefined)    updateFields.metaKeywords = metaKeywords;
    if (status !== undefined) {
      updateFields.status = status;
      if (status === "PUBLISHED") updateFields.publishedAt = new Date();
    }

    const result = await db.collection("blogs").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );
    revalidateBlogs();

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: "Post not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const db = await getDb();
    await db.collection("blogs").deleteOne({ _id: new ObjectId(id) });
    revalidateBlogs();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}
