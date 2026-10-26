import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/audit";

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const requests = await db.verificationRequest.findMany({
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      include: {
        profile: {
          select: {
            id: true,
            displayName: true,
            headline: true,
            profession: true,
            organization: true,
            profilePhotoUrl: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, requests });
  } catch (error) {
    console.error("Admin verifications fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch verification requests" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const body = await req.json();
    const { requestId, action, adminNotes } = body; // action: "APPROVE" | "REJECT"

    if (!requestId || !action) {
      return NextResponse.json({ error: "Request ID and action are required." }, { status: 400 });
    }

    const verificationReq = await db.verificationRequest.findUnique({
      where: { id: requestId },
      include: { profile: true },
    });

    if (!verificationReq) {
      return NextResponse.json({ error: "Verification request not found." }, { status: 404 });
    }

    const newStatus = action === "APPROVE" ? "APPROVED" : "REJECTED";

    await db.$transaction(async (tx) => {
      await tx.verificationRequest.update({
        where: { id: requestId },
        data: {
          status: newStatus,
          adminNotes: adminNotes || null,
          reviewedBy: session.user.fullName,
          reviewedAt: new Date(),
        },
      });

      if (action === "APPROVE") {
        // Award badge based on type
        let badgeLabel = "Verified Member";
        if (verificationReq.type === "IDENTITY") badgeLabel = "National Identity Confirmed";
        if (verificationReq.type === "PROFESSION") badgeLabel = "Professional License Verified";
        if (verificationReq.type === "ORGANIZATION") badgeLabel = "Verified Organization Executive";

        await tx.verification.create({
          data: {
            profileId: verificationReq.profileId,
            type: verificationReq.type,
            badgeLabel,
            verifiedByAdminId: session.user.userId,
          },
        });
      }
    });

    await logAuditEvent({
      actorUserId: session.user.userId,
      action: `VERIFICATION_${newStatus}`,
      entityType: "VERIFICATION_REQUEST",
      entityId: requestId,
      details: { profileId: verificationReq.profileId, action, adminNotes },
    });

    return NextResponse.json({
      success: true,
      message: `Verification request ${newStatus.toLowerCase()} successfully.`,
    });
  } catch (error) {
    console.error("Admin verification review error:", error);
    return NextResponse.json({ error: "Failed to process verification decision." }, { status: 500 });
  }
}
