/** @format */
import { NextResponse } from "next/server";
import { getDb } from "../../../../lib/mongodb";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      jobId,
      jobTitle,
      name,
      email,
      phone,
      linkedin,
      resumeUrl,
      coverMessage,
    } = body;

    if (!name || !email || !jobId) {
      return NextResponse.json(
        { success: false, message: "Name, email, and job are required." },
        { status: 400 },
      );
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email address." },
        { status: 400 },
      );
    }

    const db = await getDb();
    const application = {
      jobId,
      jobTitle: jobTitle || "",
      name,
      email,
      phone: phone || "",
      linkedin: linkedin || "",
      resumeUrl: resumeUrl || "",
      coverMessage: coverMessage || "",
      status: "NEW",
      createdAt: new Date(),
    };
    await db.collection("applications").insertOne(application);

    try {
      await resend.emails.send({
        from: "SetupGram Careers <onboarding@resend.dev>",
        to: "info@setupgram.com",
        subject: `📋 New Application: ${name} — ${jobTitle || "Job"}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#050505;color:#e2e8f0;padding:32px;border-radius:12px;border:1px solid rgba(0,240,255,0.2)">
            <h2 style="color:#00f0ff;margin-bottom:24px">New Job Application</h2>
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px 0;color:#94a3b8;width:120px">Position</td><td style="padding:8px 0;color:#fff;font-weight:600">${jobTitle || "—"}</td></tr>
              <tr><td style="padding:8px 0;color:#94a3b8">Name</td><td style="padding:8px 0;color:#fff">${name}</td></tr>
              <tr><td style="padding:8px 0;color:#94a3b8">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#00f0ff">${email}</a></td></tr>
              <tr><td style="padding:8px 0;color:#94a3b8">Phone</td><td style="padding:8px 0;color:#fff">${phone || "—"}</td></tr>
              <tr><td style="padding:8px 0;color:#94a3b8">LinkedIn</td><td style="padding:8px 0;color:#fff">${linkedin || "—"}</td></tr>
              <tr><td style="padding:8px 0;color:#94a3b8">Resume</td><td style="padding:8px 0;color:#fff">${resumeUrl ? `<a href="${resumeUrl}" style="color:#00f0ff">View Resume</a>` : "—"}</td></tr>
              <tr><td style="padding:8px 0;color:#94a3b8;vertical-align:top">Message</td><td style="padding:8px 0;color:#e2e8f0;line-height:1.6">${coverMessage || "—"}</td></tr>
            </table>
            <div style="margin-top:32px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.1)">
              <a href="https://setupgram.com/admin/careers/applications" style="display:inline-block;padding:12px 24px;background:#00f0ff;color:#050505;font-weight:700;border-radius:8px;text-decoration:none">View in Admin Panel →</a>
            </div>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Application email failed:", emailErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Application received. We'll be in touch soon.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Apply route error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 },
    );
  }
}
