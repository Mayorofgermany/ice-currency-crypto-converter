import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized access: Administrator role required." }, { status: 403 });
    }

    const [
      totalUsers,
      totalProfiles,
      searchableProfiles,
      totalVerifications,
      pendingVerifications,
      pendingReports,
      totalAuditLogs,
    ] = await Promise.all([
      db.user.count(),
      db.profile.count(),
      db.profile.count({ where: { isSearchable: true } }),
      db.verification.count(),
      db.verificationRequest.count({ where: { status: "PENDING" } }),
      db.report.count({ where: { status: "PENDING" } }),
      db.auditLog.count(),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalProfiles,
        searchableProfiles,
        totalVerifications,
        pendingVerifications,
        pendingReports,
        totalAuditLogs,
      },
    });
  } catch (error: any) {
    if (error?.digest || (typeof error?.message === "string" && error.message.includes("prerender"))) {
      throw error;
    }
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Failed to fetch admin metrics" }, { status: 500 });
  }
}
