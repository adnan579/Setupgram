/** @format */
import { NextResponse } from "next/server";
import { getDb } from "../../../../lib/mongodb";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function GET() {
  try {
    const db = await getDb();
    const jobs = await db
      .collection("jobs")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json({ success: true, jobs });
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      department,
      location,
      employmentType,
      experience,
      salaryRange,
      excerpt,
      description,
      responsibilities,
      requirements,
      benefits,
      status,
      applyEmail,
      closingDate,
      slug: slugInput,
      metaTitle,
      metaDescription,
      metaKeywords,
    } = body;

    if (!title || !description || !applyEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Title, description, and apply email are required.",
        },
        { status: 400 },
      );
    }

    const db = await getDb();
    const slug = slugify(slugInput || title);
    const existing = await db.collection("jobs").findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "A job with this slug already exists." },
        { status: 409 },
      );
    }

    const now = new Date();
    const job = {
      title,
      slug,
      department: department || "General",
      location: location || "Remote",
      employmentType: employmentType || "Full-time",
      experience: experience || "Not specified",
      salaryRange: salaryRange || "",
      excerpt: excerpt || "",
      description,
      responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
      requirements: Array.isArray(requirements) ? requirements : [],
      benefits: Array.isArray(benefits) ? benefits : [],
      status: status || "DRAFT",
      applyEmail,
      closingDate: closingDate ? new Date(closingDate) : null,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt || "",
      metaKeywords: metaKeywords || "",
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection("jobs").insertOne(job);
    return NextResponse.json(
      { success: true, id: result.insertedId },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 },
    );
  }
}
