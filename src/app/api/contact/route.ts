import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateCheck = checkRateLimit(`contact:${ip}`, 5, 60000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many messages sent. Please wait ${rateCheck.retryAfterSeconds} seconds before sending another.` },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { profileId, senderName, senderEmail, subject, message } = body;

    if (!profileId || !senderName || !senderEmail || !subject || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // Verify recipient profile exists and allows contact form
    const profile = await db.profile.findUnique({
      where: { id: profileId },
      include: { privacy: true },
    });

    if (!profile) {
      return NextResponse.json({ error: "Recipient profile not found." }, { status: 404 });
    }

    if (profile.privacy && !profile.privacy.allowContactForm) {
      return NextResponse.json(
        { error: "This individual has disabled the public contact relay." },
        { status: 403 }
      );
    }

    const contactMessage = await db.contactMessage.create({
      data: {
        recipientProfileId: profile.id,
        senderName: senderName.trim(),
        senderEmail: senderEmail.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
      },
    });

    await logAuditEvent({
      action: "CONTACT_RELAY_SENT",
      entityType: "PROFILE",
      entityId: profile.id,
      ipAddress: ip,
      details: { senderEmail: senderEmail.trim().toLowerCase(), subject },
    });

    return NextResponse.json({
      success: true,
      message: "Your message was securely relayed to the verified profile owner without revealing their private contact coordinates.",
      messageId: contactMessage.id,
    });
  } catch (error) {
    console.error("Contact relay error:", error);
    return NextResponse.json({ error: "Failed to deliver contact message." }, { status: 500 });
  }
}
