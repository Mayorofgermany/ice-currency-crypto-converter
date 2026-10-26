import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";

// PATCH /api/recommendations/[id] - Approve, hide, or reject recommendation
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recommendation = await db.recommendation.findUnique({
      where: { id },
      include: {
        recipient: { select: { userId: true, displayName: true } },
      },
    });

    if (!recommendation) {
      return NextResponse.json({ error: "Recommendation not found." }, { status: 404 });
    }

    // Only the recipient (or ADMIN) has the statutory right to curate what appears on their profile
    const isRecipient = recommendation.recipient.userId === session.user.userId;
    const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";

    if (!isRecipient && !isAdmin) {
      return NextResponse.json(
        { error: "Only the profile owner can approve or manage this recommendation." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { status } = body;

    if (!["APPROVED", "HIDDEN", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
    }

    const updated = await db.recommendation.update({
      where: { id },
      data: { status },
    });

    await logAuditEvent({
      actorUserId: session.user.userId,
      action: `RECOMMENDATION_${status}`,
      entityType: "RECOMMENDATION",
      entityId: id,
      ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
      details: { newStatus: status },
    });

    return NextResponse.json({
      success: true,
      message: `Recommendation status updated to ${status}.`,
      recommendation: updated,
    });
  } catch (error) {
    console.error("Update recommendation error:", error);
    return NextResponse.json({ error: "Failed to update recommendation." }, { status: 500 });
  }
}

// DELETE /api/recommendations/[id] - Delete recommendation
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recommendation = await db.recommendation.findUnique({
      where: { id },
      include: {
        recipient: { select: { userId: true } },
        author: { select: { userId: true } },
      },
    });

    if (!recommendation) {
      return NextResponse.json({ error: "Recommendation not found." }, { status: 404 });
    }

    const isRecipient = recommendation.recipient.userId === session.user.userId;
    const isAuthor = recommendation.author.userId === session.user.userId;
    const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";

    if (!isRecipient && !isAuthor && !isAdmin) {
      return NextResponse.json(
        { error: "You are not authorized to delete this recommendation." },
        { status: 403 }
      );
    }

    await db.recommendation.delete({ where: { id } });

    await logAuditEvent({
      actorUserId: session.user.userId,
      action: "RECOMMENDATION_DELETED",
      entityType: "RECOMMENDATION",
      entityId: id,
      ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
    });

    return NextResponse.json({
      success: true,
      message: "Recommendation removed successfully.",
    });
  } catch (error) {
    console.error("Delete recommendation error:", error);
    return NextResponse.json({ error: "Failed to delete recommendation." }, { status: 500 });
  }
}
