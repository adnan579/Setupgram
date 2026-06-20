/** @format */

import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "../../../../../lib/mongodb";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();
    const validStatuses = ["NEW", "CONTACTED", "CONVERTED", "LOST"];

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, message: "Invalid status." }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.collection("leads").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { status } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: "Lead not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDb();
    await db.collection("leads").deleteOne({ _id: new ObjectId(params.id) });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}
