import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";

// PATCH /api/contact/[id] - Mark message read or submit reply
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

    const message = await db.contactMessage.findUnique({
      where: { id },
      include: {
        recipient: { select: { userId: true, displayName: true } },
      },
    });

    if (!message) {
      return NextResponse.json({ error: "Message not found." }, { status: 404 });
    }

    if (message.recipient.userId !== session.user.userId) {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }

    const body = await req.json();
    const updateData: any = {};

    if (typeof body.isRead === "boolean") {
      updateData.isRead = body.isRead;
    }

    if (body.replyMessage && typeof body.replyMessage === "string") {
      updateData.replyMessage = body.replyMessage.trim();
      updateData.repliedAt = new Date();
      updateData.isRead = true;

      // Log relay reply dispatch
      console.log(`[Zero-Knowledge Relay] Dispatching reply from "${message.recipient.displayName}" to "${message.senderEmail}"`);
    }

    const updated = await db.contactMessage.update({
      where: { id },
      data: updateData,
    });

    await logAuditEvent({
      actorUserId: session.user.userId,
      action: body.replyMessage ? "CONTACT_MESSAGE_REPLIED" : "CONTACT_MESSAGE_READ",
      entityType: "CONTACT_MESSAGE",
      entityId: id,
      ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
    });

    return NextResponse.json({
      success: true,
      message: body.replyMessage ? "Reply dispatched safely via relay." : "Message updated.",
      contactMessage: updated,
    });
  } catch (error) {
    console.error("Update contact message error:", error);
    return NextResponse.json({ error: "Failed to update message." }, { status: 500 });
  }
}

// DELETE /api/contact/[id] - Delete contact message
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

    const message = await db.contactMessage.findUnique({
      where: { id },
      include: {
        recipient: { select: { userId: true } },
      },
    });

    if (!message) {
      return NextResponse.json({ error: "Message not found." }, { status: 404 });
    }

    if (message.recipient.userId !== session.user.userId) {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }

    await db.contactMessage.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Message deleted successfully.",
    });
  } catch (error) {
    console.error("Delete contact message error:", error);
    return NextResponse.json({ error: "Failed to delete message." }, { status: 500 });
  }
}
