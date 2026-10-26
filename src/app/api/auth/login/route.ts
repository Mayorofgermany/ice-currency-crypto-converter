import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, createSession } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateCheck = checkRateLimit(`login:${ip}`, 5, 60000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many login attempts. Please wait ${rateCheck.retryAfterSeconds} seconds before retrying.` },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
      include: {
        profile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    if (user.status === "SUSPENDED") {
      return NextResponse.json(
        { error: "This account has been suspended for terms or privacy violations. Please contact support." },
        { status: 403 }
      );
    }

    if (user.status === "DELETED") {
      return NextResponse.json({ error: "This account has been deleted." }, { status: 404 });
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    // Create session and set cookie
    await createSession(user.id, {
      ip,
      userAgent: req.headers.get("user-agent") || undefined,
    });

    await logAuditEvent({
      actorUserId: user.id,
      action: "LOGIN",
      entityType: "USER",
      entityId: user.id,
      ipAddress: ip,
    });

    return NextResponse.json({
      success: true,
      message: "Signed in successfully.",
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        profileId: user.profile?.id,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "An unexpected error occurred during login." }, { status: 500 });
  }
}
