import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/audit";

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";

    const users = await db.user.findMany({
      where: search
        ? {
            OR: [
              { fullName: { contains: search } },
              { email: { contains: search } },
            ],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        fullName: true,
        country: true,
        role: true,
        status: true,
        emailVerified: true,
        createdAt: true,
        profile: {
          select: {
            id: true,
            displayName: true,
            headline: true,
            isSearchable: true,
            completionScore: true,
            verifications: {
              select: {
                id: true,
                badgeLabel: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Admin users error:", error);
    return NextResponse.json({ error: "Failed to fetch user directory" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const body = await req.json();
    const { userId, status, role } = body;

    if (!userId) {
      return NextResponse.json({ error: "Target userId is required." }, { status: 400 });
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        status: status || undefined,
        role: role || undefined,
      },
    });

    await logAuditEvent({
      actorUserId: session.user.userId,
      action: "ADMIN_USER_MODIFICATION",
      entityType: "USER",
      entityId: userId,
      details: { status, role },
    });

    return NextResponse.json({
      success: true,
      message: "User status updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Admin user status update error:", error);
    return NextResponse.json({ error: "Failed to update user." }, { status: 500 });
  }
}
