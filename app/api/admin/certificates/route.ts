/** @format */
import { NextResponse } from "next/server";
import { getDb } from "../../../../lib/mongodb";
import { revalidateCertificates } from "../../../../lib/revalidate";
import { slugify } from "../../../../lib/utils";

const TYPE_CODES: Record<string, string> = {
  internship: "INT",
  training: "TRN",
  hackathon: "HCK",
  event: "EVT",
  "tech-camp": "CMP",
};

async function generateCertificateId(db: any, type: string, year: number) {
  const code = TYPE_CODES[type] || "GEN";
  let certificateId = "";
  let unique = false;
  while (!unique) {
    const random = Math.floor(1000 + Math.random() * 9000);
    certificateId = `SG-${code}-${year}-${random}`;
    const existing = await db
      .collection("certificates")
      .findOne({ certificateId });
    if (!existing) unique = true;
  }
  return certificateId;
}

export async function GET() {
  try {
    const db = await getDb();
    const certificates = await db
      .collection("certificates")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json({ success: true, certificates });
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
      slug: slugInput,
    } = body;

    if (!candidateName || !type || !program || !issueDate) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Candidate name, type, program, and issue date are required.",
        },
        { status: 400 },
      );
    }

    const db = await getDb();
    const year = new Date(issueDate).getFullYear();
    const certificateId = await generateCertificateId(db, type, year);

    let baseSlug = slugify(slugInput || `${candidateName}-${program}-${year}`);
    let slug = baseSlug;
    let suffix = 1;
    while (await db.collection("certificates").findOne({ slug })) {
      suffix += 1;
      slug = `${baseSlug}-${suffix}`;
    }

    const now = new Date();
    const certificate = {
      candidateName,
      slug,
      certificateId,
      type,
      program,
      issueDate: new Date(issueDate),
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      description: description || "",
      grade: grade || "",
      mentor: mentor || "",
      certificateImage: certificateImage || "",
      verificationStatus: verificationStatus || "VALID",
      createdAt: now,
    };

    const result = await db.collection("certificates").insertOne(certificate);
    revalidateCertificates();
    return NextResponse.json(
      { success: true, id: result.insertedId, slug, certificateId },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 },
    );
  }
}
