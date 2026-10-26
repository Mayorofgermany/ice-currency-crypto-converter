import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { type, evidenceText, documentUrl } = body;

    if (!type || !evidenceText) {
      return NextResponse.json({ error: "Verification type and evidence details are required." }, { status: 400 });
    }

    const profile = await db.profile.findUnique({
      where: { userId: session.user.userId },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    }

    // Check for existing pending request of the same type
    const existingPending = await db.verificationRequest.findFirst({
      where: {
        profileId: profile.id,
        type,
        status: "PENDING",
      },
    });

    if (existingPending) {
      return NextResponse.json(
        { error: "You already have a pending verification request of this type under review." },
        { status: 409 }
      );
    }

    const request = await db.verificationRequest.create({
      data: {
        profileId: profile.id,
        userId: session.user.userId,
        type,
        status: "PENDING",
        evidenceText: evidenceText.trim(),
        documentUrl: documentUrl || null,
      },
    });

    await logAuditEvent({
      actorUserId: session.user.userId,
      action: "VERIFICATION_REQUESTED",
      entityType: "VERIFICATION_REQUEST",
      entityId: request.id,
      details: { type },
    });

    return NextResponse.json({
      success: true,
      message: "Verification application submitted for administrative review.",
      request,
    });
  } catch (error) {
    console.error("Verification submit error:", error);
    return NextResponse.json({ error: "Failed to submit verification request." }, { status: 500 });
  }
}
