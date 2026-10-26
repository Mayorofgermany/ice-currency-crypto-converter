import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateCheck = checkRateLimit(`register:${ip}`, 5, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many registration attempts. Please retry in ${rateCheck.retryAfterSeconds} seconds.` },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { fullName, email, password, confirmPassword, country, termsAccepted, privacyConsent } = body;

    // Validation
    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
      return NextResponse.json({ error: "Please enter your full legal or professional name." }, { status: 400 });
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (!password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long." }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
    }

    if (!termsAccepted || !privacyConsent) {
      return NextResponse.json(
        { error: "Explicit consent to Terms of Service and Privacy Policy is required under NDPR and GDPR regulations." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if email already registered
    const existingUser = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please sign in instead." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    // Create User, Profile, and ProfilePrivacy in a single transaction
    const newUser = await db.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        fullName: fullName.trim(),
        country: country || "Nigeria",
        role: "USER",
        status: "ACTIVE",
        termsAcceptedAt: new Date(),
        privacyConsentAt: new Date(),
        profile: {
          create: {
            displayName: fullName.trim(),
            country: country || "Nigeria",
            isSearchable: true,
            completionScore: 25,
            privacy: {
              create: {
                overallVisibility: "PUBLIC",
                emailVisibility: "PRIVATE",
                phoneVisibility: "PRIVATE",
                locationVisibility: "CITY_ONLY",
                experienceVisibility: "PUBLIC",
                educationVisibility: "PUBLIC",
                skillsVisibility: "PUBLIC",
                linksVisibility: "PUBLIC",
                allowContactForm: true,
              },
            },
          },
        },
      },
      include: {
        profile: true,
      },
    });

    // Create session and set cookie
    await createSession(newUser.id, {
      ip,
      userAgent: req.headers.get("user-agent") || undefined,
    });

    await logAuditEvent({
      actorUserId: newUser.id,
      action: "REGISTER",
      entityType: "USER",
      entityId: newUser.id,
      ipAddress: ip,
      details: { email: normalizedEmail, country },
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully.",
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
        profileId: newUser.profile?.id,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Failed to create account. Please try again." }, { status: 500 });
  }
}
