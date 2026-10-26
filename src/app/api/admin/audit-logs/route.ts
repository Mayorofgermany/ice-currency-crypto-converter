import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized access: Administrator role required." }, { status: 403 });
    }

    const logs = await db.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 60,
      include: {
        actor: {
          select: {
            fullName: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    if (error?.digest || (typeof error?.message === "string" && error.message.includes("prerender"))) {
      throw error;
    }
    console.error("Admin audit logs fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch audit records" }, { status: 500 });
  }
}
