import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    const body = await req.json();
    const { profileId, category, details } = body;

    if (!profileId || !category || !details) {
      return NextResponse.json({ error: "Profile ID, category, and report details are required." }, { status: 400 });
    }

    const profile = await db.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    }

    const report = await db.report.create({
      data: {
        reportedProfileId: profile.id,
        reporterUserId: session?.user.userId || null,
        category,
        details: details.trim(),
        status: "PENDING",
      },
    });

    await logAuditEvent({
      actorUserId: session?.user.userId || null,
      action: "REPORT_SUBMITTED",
      entityType: "REPORT",
      entityId: report.id,
      details: { profileId, category },
    });

    return NextResponse.json({
      success: true,
      message: "Report submitted to the trust and moderation team. Thank you for maintaining directory integrity.",
      reportId: report.id,
    });
  } catch (error) {
    console.error("Report submission error:", error);
    return NextResponse.json({ error: "Failed to submit report." }, { status: 500 });
  }
}
