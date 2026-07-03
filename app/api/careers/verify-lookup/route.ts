/** @format */
import { NextResponse } from "next/server";
import { getDb } from "../../../../lib/mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();
    if (!q) {
      return NextResponse.json(
        { success: false, message: "No query provided." },
        { status: 400 },
      );
    }

    const db = await getDb();
    const cert = await db.collection("certificates").findOne({
      $or: [{ certificateId: q }, { slug: q.toLowerCase() }],
    });

    if (!cert) {
      return NextResponse.json(
        { success: false, message: "Certificate not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, slug: cert.slug });
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 },
    );
  }
}
