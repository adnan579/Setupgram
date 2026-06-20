/** @format */

import { NextResponse } from "next/server";
import { getDb } from "../../../../lib/mongodb";

export async function GET() {
  try {
    const db = await getDb();
    const posts = await db.collection("blogs").find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, posts });
  } catch {
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title, category, excerpt, content, slug, status,
      coverImage, metaTitle, metaDescription, metaKeywords,
    } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { success: false, message: "Title, slug, and content are required." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const existing = await db.collection("blogs").findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "A post with this slug already exists." },
        { status: 409 }
      );
    }

    const now = new Date();
    const post = {
      title,
      category: category || "General",
      excerpt: excerpt || "",
      content,
      slug,
      status: status || "DRAFT",
      coverImage: coverImage || "",
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt || "",
      metaKeywords: metaKeywords || "",
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection("blogs").insertOne(post);
    return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}
