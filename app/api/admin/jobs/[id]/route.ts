/** @format */
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "../../../../../lib/mongodb";
import { revalidateJobs } from "../../../../../lib/revalidate";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
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
      slug,
      metaTitle,
      metaDescription,
      metaKeywords,
    } = body;

    const db = await getDb();

    if (slug) {
      const existing = await db
        .collection("jobs")
        .findOne({ slug, _id: { $ne: new ObjectId(id) } });
      if (existing) {
        return NextResponse.json(
          { success: false, message: "A job with this slug already exists." },
          { status: 409 },
        );
      }
    }

    const updateFields: Record<string, unknown> = { updatedAt: new Date() };
    if (title !== undefined) updateFields.title = title;
    if (department !== undefined) updateFields.department = department;
    if (location !== undefined) updateFields.location = location;
    if (employmentType !== undefined)
      updateFields.employmentType = employmentType;
    if (experience !== undefined) updateFields.experience = experience;
    if (salaryRange !== undefined) updateFields.salaryRange = salaryRange;
    if (excerpt !== undefined) updateFields.excerpt = excerpt;
    if (description !== undefined) updateFields.description = description;
    if (responsibilities !== undefined)
      updateFields.responsibilities = responsibilities;
    if (requirements !== undefined) updateFields.requirements = requirements;
    if (benefits !== undefined) updateFields.benefits = benefits;
    if (status !== undefined) updateFields.status = status;
    if (applyEmail !== undefined) updateFields.applyEmail = applyEmail;
    if (closingDate !== undefined)
      updateFields.closingDate = closingDate ? new Date(closingDate) : null;
    if (slug !== undefined) updateFields.slug = slug;
    if (metaTitle !== undefined) updateFields.metaTitle = metaTitle;
    if (metaDescription !== undefined)
      updateFields.metaDescription = metaDescription;
    if (metaKeywords !== undefined) updateFields.metaKeywords = metaKeywords;

    const result = await db
      .collection("jobs")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateFields });
    revalidateJobs();
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Job not found." },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const db = await getDb();
    await db.collection("jobs").deleteOne({ _id: new ObjectId(id) });
    revalidateJobs();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 },
    );
  }
}
