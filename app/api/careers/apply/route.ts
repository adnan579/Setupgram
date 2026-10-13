/** @format */
import { checkRateLimit, getClientIp } from "../../../../lib/rateLimit";
import { NextResponse } from "next/server";
import { getDb } from "../../../../lib/mongodb";
import { Resend } from "resend";
import { cleanText, escapeHtml, safeHttpsUrl } from "../../../../lib/validate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfterSeconds } = await checkRateLimit(`careers-apply:${ip}`, 5, 10 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Too many applications submitted. Please try again in ${Math.ceil(retryAfterSeconds / 60)} minute(s).`,
        },
        { status: 429 },
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, message: "Invalid request." },
        { status: 400 },
      );
    }

    // Clean + cap every public input (non-strings become "")
    const jobId = cleanText(body.jobId, 50);
    const jobTitle = cleanText(body.jobTitle, 150);
    const name = cleanText(body.name, 100);
    const email = cleanText(body.email, 254);
    const phone = cleanText(body.phone, 30);
    const coverMessage = cleanText(body.coverMessage, 3000, { multiline: true });

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

    // LinkedIn is optional, but if given it must be a real https:// URL.
    // (Blocks javascript: / data: links that would run when you click them in the admin panel.)
    const rawLinkedin = typeof body.linkedin === "string" ? body.linkedin.trim() : "";
    const linkedin = rawLinkedin ? safeHttpsUrl(rawLinkedin) : "";
    if (rawLinkedin && !linkedin) {
      return NextResponse.json(
        { success: false, message: "LinkedIn must be a valid https:// link." },
        { status: 400 },
      );
    }

    // Resume is optional, but if given it must be a file in YOUR Cloudinary account.
    const rawResume = typeof body.resumeUrl === "string" ? body.resumeUrl.trim() : "";
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    let resumeUrl = "";
    if (rawResume) {
      resumeUrl = safeHttpsUrl(rawResume, ["res.cloudinary.com"]);
      const belongsToUs =
        !!cloudName && !!resumeUrl && new URL(resumeUrl).pathname.startsWith(`/${cloudName}/`);
      if (!resumeUrl || !belongsToUs) {
        return NextResponse.json(
          { success: false, message: "Invalid resume link. Please upload the file again." },
          { status: 400 },
        );
      }
    }

    const db = await getDb();
    const application = {
      jobId,
      jobTitle,
      name,
      email,
      phone,
      linkedin,
      resumeUrl,
      coverMessage,
      status: "NEW",
      createdAt: new Date(),
    };
    await db.collection("applications").insertOne(application);

    // Application is saved; a failed notification email must not fail the request.
    // Resend v3 returns { data, error } instead of throwing, so check both.
    try {
      const { error: emailError } = await resend.emails.send({
        from: "SetupGram Careers <onboarding@resend.dev>",
        to: "info@setupgram.com",
        subject: `📋 New Application: ${name} — ${jobTitle || "Job"}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#050505;color:#e2e8f0;padding:32px;border-radius:12px;border:1px solid rgba(0,240,255,0.2)">
            <h2 style="color:#00f0ff;margin-bottom:24px">New Job Application</h2>
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px 0;color:#94a3b8;width:120px">Position</td><td style="padding:8px 0;color:#fff;font-weight:600">${escapeHtml(jobTitle) || "—"}</td></tr>
              <tr><td style="padding:8px 0;color:#94a3b8">Name</td><td style="padding:8px 0;color:#fff">${escapeHtml(name)}</td></tr>
              <tr><td style="padding:8px 0;color:#94a3b8">Email</td><td style="padding:8px 0"><a href="mailto:${escapeHtml(email)}" style="color:#00f0ff">${escapeHtml(email)}</a></td></tr>
              <tr><td style="padding:8px 0;color:#94a3b8">Phone</td><td style="padding:8px 0;color:#fff">${escapeHtml(phone) || "—"}</td></tr>
              <tr><td style="padding:8px 0;color:#94a3b8">LinkedIn</td><td style="padding:8px 0;color:#fff">${linkedin ? `<a href="${escapeHtml(linkedin)}" style="color:#00f0ff">${escapeHtml(linkedin)}</a>` : "—"}</td></tr>
              <tr><td style="padding:8px 0;color:#94a3b8">Resume</td><td style="padding:8px 0;color:#fff">${resumeUrl ? `<a href="${escapeHtml(resumeUrl)}" style="color:#00f0ff">View Resume</a>` : "—"}</td></tr>
              <tr><td style="padding:8px 0;color:#94a3b8;vertical-align:top">Message</td><td style="padding:8px 0;color:#e2e8f0;line-height:1.6">${coverMessage ? escapeHtml(coverMessage).replace(/\n/g, "<br />") : "—"}</td></tr>
            </table>
            <div style="margin-top:32px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.1)">
              <a href="https://setupgram.com/admin/careers/applications" style="display:inline-block;padding:12px 24px;background:#00f0ff;color:#050505;font-weight:700;border-radius:8px;text-decoration:none">View in Admin Panel →</a>
            </div>
          </div>
        `,
      });
      if (emailError) {
        console.error("Application email failed:", emailError);
      }
    } catch (emailErr) {
      console.error("Application email threw:", emailErr);
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
