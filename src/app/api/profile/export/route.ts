import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/audit";

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userData = await db.user.findUnique({
      where: { id: session.user.userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        country: true,
        role: true,
        status: true,
        termsAcceptedAt: true,
        privacyConsentAt: true,
        createdAt: true,
        profile: {
          include: {
            privacy: true,
            experiences: true,
            educations: true,
            skills: true,
            publicLinks: true,
            verifications: true,
            verificationRequests: true,
            contactMessages: true,
          },
        },
        auditLogs: {
          take: 50,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!userData) {
      return NextResponse.json({ error: "User record not found" }, { status: 404 });
    }

    await logAuditEvent({
      actorUserId: session.user.userId,
      action: "DATA_EXPORT_NDPR",
      entityType: "USER",
      entityId: session.user.userId,
    });

    const exportPayload = {
      exportMetadata: {
        platform: "IgamaZi - Consent-based People Information Directory",
        legalStandard: "NDPR (Nigeria Data Protection Regulation) & GDPR Article 20 Compliant",
        exportedAt: new Date().toISOString(),
        subjectEmail: userData.email,
        subjectId: userData.id,
      },
      personalData: userData,
    };

    return new NextResponse(JSON.stringify(exportPayload, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="igamazi_data_export_${userData.id.slice(0, 8)}.json"`,
      },
    });
  } catch (error: any) {
    if (error?.digest || (typeof error?.message === "string" && error.message.includes("prerender"))) {
      throw error;
    }
    console.error("Data export error:", error);
    return NextResponse.json({ error: "Failed to export data." }, { status: 500 });
  }
}
