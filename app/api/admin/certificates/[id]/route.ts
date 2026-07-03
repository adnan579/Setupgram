/** @format */
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "../../../../../lib/mongodb";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    const {
      candidateName,
      type,
      program,
      issueDate,
      startDate,
      endDate,
      description,
      grade,
      mentor,
      certificateImage,
      verificationStatus,
      slug,
    } = body;

    const db = await getDb();

    if (slug) {
      const existing = await db
        .collection("certificates")
        .findOne({ slug, _id: { $ne: new ObjectId(params.id) } });
      if (existing) {
        return NextResponse.json(
          {
            success: false,
            message: "A certificate with this slug already exists.",
          },
          { status: 409 },
        );
      }
    }

    const updateFields: Record<string, unknown> = {};
    if (candidateName !== undefined) updateFields.candidateName = candidateName;
    if (type !== undefined) updateFields.type = type;
    if (program !== undefined) updateFields.program = program;
    if (issueDate !== undefined) updateFields.issueDate = new Date(issueDate);
    if (startDate !== undefined)
      updateFields.startDate = startDate ? new Date(startDate) : null;
    if (endDate !== undefined)
      updateFields.endDate = endDate ? new Date(endDate) : null;
    if (description !== undefined) updateFields.description = description;
    if (grade !== undefined) updateFields.grade = grade;
    if (mentor !== undefined) updateFields.mentor = mentor;
    if (certificateImage !== undefined)
      updateFields.certificateImage = certificateImage;
    if (verificationStatus !== undefined)
      updateFields.verificationStatus = verificationStatus;
    if (slug !== undefined) updateFields.slug = slug;

    const result = await db
      .collection("certificates")
      .updateOne({ _id: new ObjectId(params.id) }, { $set: updateFields });
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Certificate not found." },
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
  { params }: { params: { id: string } },
) {
  try {
    const db = await getDb();
    await db
      .collection("certificates")
      .deleteOne({ _id: new ObjectId(params.id) });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 },
    );
  }
}
