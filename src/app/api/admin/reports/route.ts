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

    const reports = await db.report.findMany({
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      include: {
        reportedProfile: {
          select: {
            id: true,
            displayName: true,
            headline: true,
          },
        },
        reporter: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, reports });
  } catch (error) {
    console.error("Admin reports fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const body = await req.json();
    const { reportId, status, actionTaken } = body; // status: "INVESTIGATING" | "RESOLVED" | "DISMISSED"

    if (!reportId || !status) {
      return NextResponse.json({ error: "Report ID and target status are required." }, { status: 400 });
    }

    const updated = await db.report.update({
      where: { id: reportId },
      data: {
        status,
        actionTaken: actionTaken || null,
        resolvedBy: session.user.fullName,
      },
    });

    await logAuditEvent({
      actorUserId: session.user.userId,
      action: `REPORT_${status}`,
      entityType: "REPORT",
      entityId: reportId,
      details: { status, actionTaken },
    });

    return NextResponse.json({
      success: true,
      message: "Report resolution updated.",
      report: updated,
    });
  } catch (error) {
    console.error("Admin report update error:", error);
    return NextResponse.json({ error: "Failed to update report." }, { status: 500 });
  }
}
